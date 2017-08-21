declare const R: any;
declare const fs: any;
declare const http: any;
declare const urlParser: any;
declare var DOWNLOAD_DIR: string;
declare const openHtmlFile: (file: string) => Promise<{}>;
declare const scriptPtrn: RegExp;
declare const getTag: (html: string) => string | null;
declare const getAllSrcs: (html: string, idx?: number, matches?: RegExpExecArray[]) => RegExpExecArray[];
declare const downloadFile: (exec: RegExpExecArray) => Promise<{}>;
declare const downloadFiles: (matches: RegExpExecArray[]) => RegExpExecArray[];
declare const parseFile: (file: string) => Promise<void | RegExpExecArray[]>;
