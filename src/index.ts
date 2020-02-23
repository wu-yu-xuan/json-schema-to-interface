import { info, setFailed, getInput } from '@actions/core';

try {
  info(`hello ${getInput('name')}!`);
} catch (e) {
  setFailed(`Action failed with ${e}`);
}
