import * as migration_20261105_174536_initial from './20261105_174536_initial';
import * as migration_20261105_193942_users_roles from './20261105_193942_users_roles';

export const migrations = [
  {
    up: migration_20261105_174536_initial.up,
    down: migration_20261105_174536_initial.down,
    name: '20261105_174536_initial',
  },
  {
    up: migration_20261105_193942_users_roles.up,
    down: migration_20261105_193942_users_roles.down,
    name: '20261105_193942_users_roles'
  },
];
