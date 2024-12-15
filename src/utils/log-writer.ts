import * as FileStreamRotator from 'file-stream-rotator';

import appRoot from 'app-root-path';
import {ENVIRONMENT} from '../config';

export class Logger {
  private static stream = FileStreamRotator.getStream;

  private static defaultStreamOptions = {
    frequency: 'daily',
    date_format: 'YYYY-MM-DD',
    size: '10M',
    max_logs: '5',
    extension: '.log',
    create_symlink: true,
  };

  public static errorFileStream = this.stream({
    ...this.defaultStreamOptions,
    filename: appRoot + '/tmp/error_log-%DATE%',
    audit_file: appRoot + '/tmp/error_log_audit.json',
    symlink_name: 'error_log_tail-current.log',
  });

  public static infoFileStream = this.stream({
    ...this.defaultStreamOptions,
    filename: appRoot + '/tmp/info_log-%DATE%',
    audit_file: appRoot + '/tmp/info_log_audit.json',
    symlink_name: 'info_log_tail-current.log',
  });

  public static successResponseFileStream = this.stream({
    ...this.defaultStreamOptions,
    filename: appRoot + '/tmp/success_log-%DATE%',
    audit_file: appRoot + '/tmp/success_log_audit.json',
    symlink_name: 'success_log_tail-current.log',
  });

  public static error(err: Error, descriptor?: string) {
    if (ENVIRONMENT !== 'production') {
      console.error(err);
    }

    const errString = JSON.stringify(err);
    this.errorFileStream.write(
      `${new Date()}--` +
        (descriptor ? `${descriptor}: ` : '') +
        errString +
        '\n'
    );
  }

  public static info(info: string) {
    if (ENVIRONMENT !== 'production') {
      console.log(info);
    }

    this.infoFileStream.write(`${new Date()}--` + info + '\n');
  }

  // public static successResponse(log: string) {
  // 	this.successResponseFileStream.write(log + "\n");
  // }
}
