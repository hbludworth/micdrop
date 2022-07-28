import sharp, { OverlayOptions } from 'sharp';
import { CustomPlaybackRow } from 'types';
import hexToRGB from 'hex-rgb';
import AWS from 'aws-sdk';

const createPlaceholderImage = async (
  customPlayback: CustomPlaybackRow
): Promise<Buffer> => {
  const s3 = new AWS.S3();

  const backgroundColor = hexToRGB(customPlayback.backgroundColor);
  const scrubberColor = hexToRGB(customPlayback.scrubberColor);
  const playButtonColor = hexToRGB(customPlayback.playButtonColor);
  const playIconColor = hexToRGB(customPlayback.playPauseIconColor);
  const timeBackgroundColor = hexToRGB(customPlayback.timeBackgroundColor);

  // CREATE SCRUBBER
  const scrubber = await sharp({
    create: {
      width: 375,
      height: 24,
      channels: 4,
      background: {
        r: scrubberColor.red,
        g: scrubberColor.green,
        b: scrubberColor.blue,
        alpha: 0.2,
      },
    },
  })
    .composite([
      {
        input: './src/utils/composites/scrubber.png',
        blend: 'dest-out',
      },
    ])
    .png()
    .toBuffer();

  // CREATE PLAY ICON
  const playIcon = await sharp({
    create: {
      width: 41,
      height: 41,
      channels: 3,
      background: {
        r: playIconColor.red,
        g: playIconColor.green,
        b: playIconColor.blue,
      },
    },
  })
    .composite([
      {
        input: './src/utils/composites/triangle_mask.png',
        blend: 'dest-out',
      },
    ])
    .png()
    .toBuffer();

  // CREATE PLAY BUTTON
  const playButton = await sharp({
    create: {
      width: 122,
      height: 122,
      channels: 3,
      background: {
        r: playButtonColor.red,
        g: playButtonColor.green,
        b: playButtonColor.blue,
      },
    },
  })
    .composite([
      {
        input: './src/utils/composites/circle_mask.png',
        blend: 'dest-out',
      },
      {
        input: playIcon,
        blend: 'over',
        top: 40,
        left: 48,
      },
    ])
    .png()
    .toBuffer();

  // GET CIRCLE IMAGE FILE FROM S3
  const circleImageFile = customPlayback.circleImage
    ? ((
        await s3
          .getObject({
            Bucket: 'micdrop-custom-images',
            Key: customPlayback.circleImage,
          })
          .promise()
      ).Body as Buffer)
    : null;

  // CREATE TIME TEXT
  const timeText = Buffer.from(`
    <svg width="${95}" height="${40}">
      <style>
      .title { fill: ${
        customPlayback.timeFontColor
      }; font-size: 35px; font-weight: 500; font-family: 'Roboto', sans-serif; }
      </style>
      <text x="50%" y="80%" text-anchor="middle" class="title">${'00:00'}</text>
    </svg>`);
  const timeTextImage = await sharp(timeText).png().toBuffer();

  // CREATE CIRCLE IMAGE
  const circleImage = circleImageFile
    ? await sharp(circleImageFile)
        .resize(122, 122)
        .composite([
          {
            input: './src/utils/composites/circle_mask.png',
            blend: 'dest-out',
          },
        ])
        .png()
        .toBuffer()
    : await sharp({
        create: {
          width: 122,
          height: 122,
          channels: 3,
          background: {
            r: timeBackgroundColor.red,
            g: timeBackgroundColor.green,
            b: timeBackgroundColor.blue,
          },
        },
      })
        .composite([
          {
            input: './src/utils/composites/circle_mask.png',
            blend: 'dest-out',
          },
          {
            input: timeTextImage,
            blend: 'over',
          },
        ])
        .png()
        .toBuffer();

  // CREATE SIGNATURE TEXT
  const signatureText = Buffer.from(`
    <svg width="${770}" height="${40}">
      <style>
      .title { fill: #616d7d; font-size: 25px; font-weight: 500; font-family: 'Roboto', sans-serif; }
      </style>
      <text x="50%" y="80%" text-anchor="middle" class="title">${customPlayback.signatureText.toUpperCase()}</text>
    </svg>`);
  const signatureTextImage = await sharp(signatureText).trim().png().toBuffer();

  // GET SIGNATURE IMAGE FILE FROM S3
  const signatureImageFile = customPlayback.signatureImage
    ? ((
        await s3
          .getObject({
            Bucket: 'micdrop-custom-images',
            Key: customPlayback.signatureImage,
          })
          .promise()
      ).Body as Buffer)
    : null;

  // CREATE SIGNATURE IMAGE
  const signatureImage = signatureImageFile
    ? await sharp(signatureImageFile)
        .resize(null, 30, { fit: 'contain', position: 'center' })
        .trim()
        .png()
        .toBuffer()
    : null;

  const signatureTextWidth =
    (await sharp(signatureTextImage).metadata()).width || 0;
  const signatureImageWidth = signatureImage
    ? (await sharp(signatureImage).metadata()).width || 0
    : 0;

  const totalSignatureWidth = signatureTextWidth + signatureImageWidth;

  const margin = Math.round((770 - totalSignatureWidth) / 2);

  // CREATE FINAL COMPOSITE
  const placeholderImage = await sharp({
    create: {
      width: 770,
      height: 230,
      channels: 3,
      background: {
        r: backgroundColor.red,
        g: backgroundColor.green,
        b: backgroundColor.blue,
      },
    },
  })
    .composite(
      (
        [
          {
            input: './src/utils/composites/base_pill.png',
            blend: 'dest-out',
          },
          {
            input: './src/utils/composites/inner_pill.png',
            blend: 'over',
            top: 24,
            left: 165,
          },
          {
            input: scrubber,
            blend: 'over',
            top: 72,
            left: 197,
          },
          {
            input: playButton,
            blend: 'over',
            top: 24,
            left: 24,
          },
          {
            input: circleImage,
            blend: 'over',
            top: 24,
            left: 624,
          },
          {
            input: signatureTextImage,
            blend: 'over',
            top: 183,
            left: margin - 7,
          },
          signatureImage
            ? {
                input: signatureImage,
                blend: 'over',
                top: 180,
                left: 770 - margin - signatureImageWidth + 7,
              }
            : null,
        ] as OverlayOptions[]
      ).filter((option) => option !== null)
    )
    .png()
    .toBuffer();

  return placeholderImage;
};

export default createPlaceholderImage;
