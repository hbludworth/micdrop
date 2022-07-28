import UserDao from '../api/daos/UserDao';
import AudioDao from '../api/daos/AudioDao';
import AudioGroupsDao from '../api/daos/AudioGroupsDao';
import SubscriptionsDao from '../api/daos/SubscriptionsDao';
import CustomPlaybackDao from 'src/api/daos/CustomPlaybackDao';

const instances: { [key: string]: any } = {};

export type ServiceTypes = {
  UserDao: typeof UserDao;
  AudioDao: typeof AudioDao;
  AudioGroupsDao: typeof AudioGroupsDao;
  SubscriptionsDao: typeof SubscriptionsDao;
  CustomPlaybackDao: typeof CustomPlaybackDao;
};

export default {
  set<K extends keyof ServiceTypes, V extends ServiceTypes[K]>(
    instanceId: K,
    instance: V
  ): void {
    instances[instanceId] = instance;
  },

  get<K extends keyof ServiceTypes, V extends ServiceTypes[K]>(
    instanceId: K
  ): V {
    return instances[instanceId];
  },
};
