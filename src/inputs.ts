import { getInput, info } from '@actions/core';

const inputs = {
  inputDir: getInput('input_dir'),
  outputDir: getInput('output_dir'),
  outputInterface: getInput('output_interface')
} as const;

Object.entries(inputs).forEach(([key, value]) => info(`${key}: ${value}`));

export default inputs;
