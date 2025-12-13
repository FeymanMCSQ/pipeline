// lib/validators/errors.ts

export type AiBatchFailStage = 'json_parse' | 'schema';

export class AiBatchError extends Error {
  stage: AiBatchFailStage;

  constructor(stage: AiBatchFailStage, message: string) {
    super(message);
    this.stage = stage;
    this.name = 'AiBatchError';
  }
}
