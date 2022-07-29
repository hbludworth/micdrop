import sharp, { OverlayOptions } from 'sharp';
import { CustomPlaybackRow } from 'types';
import hexToRGB from 'hex-rgb';
import AWS from 'aws-sdk';
import makerjs from 'makerjs';
import opentype from 'opentype.js';

const createPlaceholderImage = async (
  customPlayback: CustomPlaybackRow
): Promise<Buffer> => {
  const s3 = new AWS.S3();

  const roboto = await opentype.load('./fonts/Roboto-Regular.ttf');

  const backgroundColor = hexToRGB(customPlayback.backgroundColor);
  const scrubberColor = hexToRGB(customPlayback.scrubberColor);
  const playButtonColor = hexToRGB(customPlayback.playButtonColor);
  const playIconColor = hexToRGB(customPlayback.playPauseIconColor);
  const timeBackgroundColor = hexToRGB(customPlayback.timeBackgroundColor);

  const scrubberComposite = (
    await s3
      .getObject({
        Bucket: 'micdrop-custom-composites',
        Key: 'scrubber.png',
      })
      .promise()
  ).Body as Buffer;
  const triangleMaskComposite = (
    await s3
      .getObject({
        Bucket: 'micdrop-custom-composites',
        Key: 'triangle_mask.png',
      })
      .promise()
  ).Body as Buffer;
  const circleMaskComposite = (
    await s3
      .getObject({
        Bucket: 'micdrop-custom-composites',
        Key: 'circle_mask.png',
      })
      .promise()
  ).Body as Buffer;
  const innerPillComposite = (
    await s3
      .getObject({
        Bucket: 'micdrop-custom-composites',
        Key: 'inner_pill.png',
      })
      .promise()
  ).Body as Buffer;
  const basePillComposite = (
    await s3
      .getObject({
        Bucket: 'micdrop-custom-composites',
        Key: 'base_pill.png',
      })
      .promise()
  ).Body as Buffer;

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
        input: scrubberComposite,
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
        input: triangleMaskComposite,
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
        input: circleMaskComposite,
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
  const timeTextModel = new makerjs.models.Text(
    roboto,
    '00:00',
    35,
    false,
    false,
    0
  );
  const timeTextSVG = makerjs.exporter.toSVG(timeTextModel, {
    fill: customPlayback.timeFontColor,
    fontSize: '35',
    stroke: customPlayback.timeFontColor,
  });
  const timeTextImage = await sharp(Buffer.from(timeTextSVG)).png().toBuffer();

  // CREATE CIRCLE IMAGE
  const circleImage = circleImageFile
    ? await sharp(circleImageFile)
        .resize(122, 122)
        .composite([
          {
            input: circleMaskComposite,
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
            input: circleMaskComposite,
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
  const signatureTextModel = new makerjs.models.Text(
    roboto,
    customPlayback.signatureText.toUpperCase(),
    25,
    false,
    false,
    0,
    {
      letterSpacing: 0.25,
    }
  );
  const signatureTextSVG = makerjs.exporter.toSVG(signatureTextModel, {
    fill: '#616d7d',
    fontSize: '25',
    stroke: '#616d7d',
  });
  const signatureTextImage = customPlayback.signatureText
    ? await sharp(Buffer.from(signatureTextSVG)).trim().png().toBuffer()
    : null;

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

  const signatureTextWidth = signatureTextImage
    ? (await sharp(signatureTextImage).metadata()).width || 0
    : 0;
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
            input: basePillComposite,
            blend: 'dest-out',
          },
          {
            input: innerPillComposite,
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
          signatureTextImage
            ? {
                input: signatureTextImage,
                blend: 'over',
                top: 183,
                left: margin - 7,
              }
            : null,
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
