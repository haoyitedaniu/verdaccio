/// <reference types="node" />
import { PassThrough, PipelinePromise, Readable, Stream, Writable } from 'stream';

declare module '@verdaccio/types' {
  type StringValue = string | void | null;

  type StorageList = string[];
  type Callback = Function;
  // FIXME: err should be something flexible enough for any implementation
  type CallbackAction = (err: any | null) => void;
  interface Author {
    username?: string;
    name: string;
    email?: string;
    url?: string;
  }

  type PackageManagers = 'pnpm' | 'yarn' | 'npm';

  // FUTURE: WebConf and TemplateUIOptions should be merged .
  type CommonWebConf = {
    title?: string;
    logo?: string;
    favicon?: string;
    gravatar?: boolean;
    sort_packages?: string;
    darkMode?: boolean;
    url_prefix?: string;
    language?: string;
    login?: boolean;
    scope?: string;
    pkgManagers?: PackageManagers[];
  };

  /**
   * Options are passed to the index.html
   */
  export type TemplateUIOptions = {
    uri?: string;
    darkMode?: boolean;
    protocol?: string;
    host?: string;
    // deprecated
    basename?: string;
    scope?: string;
    showInfo?: boolean;
    showSettings?: boolean;
    showSearch?: boolean;
    showFooter?: boolean;
    showThemeSwitch?: boolean;
    showDownloadTarball?: boolean;
    showRaw?: boolean;
    base: string;
    primaryColor?: string;
    version?: string;
    logoURI?: string;
    flags: FlagsConfig;
  } & CommonWebConf;

  /**
   * Options on config.yaml for web
   */
  type WebConf = {
    // FIXME: rename to primaryColor and move it to CommonWebConf
    primary_color?: string;
    enable?: boolean;
    scriptsHead?: string[];
    scriptsBodyAfter?: string[];
    metaScripts?: string[];
    bodyBefore?: string[];
    bodyAfter?: string[];
  } & CommonWebConf;

  interface Signatures {
    keyid: string
    sig: string;
  }

  interface Dist {
    'npm-signature'?: string;
    fileCount?: number;
    integrity?: string;
    shasum: string;
    unpackedSize?: number;
    tarball: string;
  }

  interface RemoteUser {
    real_groups: string[];
    groups: string[];
    name: string | void;
    error?: string;
  }

  interface LocalStorage {
    list: any;
    secret: string;
  }

  interface Version {
    name: string;
    version: string;
    devDependencies?: string;
    directories?: any;
    dist: Dist;
    author: string | Author;
    main: string;
    homemage?: string;
    license?: string;
    readme: string;
    readmeFileName?: string;
    readmeFilename?: string;
    description: string;
    bin?: string;
    bugs?: any;
    files?: string[];
    gitHead?: string;
    maintainers?: Author[];
    contributors?: Author[];
    repository?: string | any;
    scripts?: any;
    homepage?: string;
    etag?: string;
    dependencies: any;
    keywords?: string | string[];
    nodeVersion?: string;
    _id: string;
    _npmVersion?: string;
    _npmUser: Author;
    _hasShrinkwrap?: boolean;
    deprecated?: string;
  }

  interface Logger {
    child: (conf: any) => any;
    debug: (conf: any, template?: string) => void;
    error: (conf: any, template?: string) => void;
    http: (conf: any, template?: string) => void;
    trace: (conf: any, template?: string) => void;
    warn: (conf: any, template?: string) => void;
    info: (conf: any, template?: string) => void;
  }

  interface Versions {
    [key: string]: Version;
  }

  interface DistFile {
    url: string;
    sha: string;
    registry?: string;
  }

  interface MergeTags {
    [key: string]: string;
  }

  interface DistFiles {
    [key: string]: DistFile;
  }

  interface AttachMents {
    [key: string]: AttachMentsItem;
  }

  interface AttachMentsItem {
    content_type?: string;
    // FIXME: should be mandatory, review
    data?: string;
    length?: number;
    shasum?: string;
    version?: string;
  }

  interface GenericBody {
    [key: string]: string;
  }

  interface UpLinkMetadata {
    etag: string;
    fetched: number;
  }

  interface UpLinks {
    [key: string]: UpLinkMetadata;
  }

  interface Tags {
    [key: string]: Version;
  }

  interface Headers {
    [key: string]: string;
  }

  interface PackageUsers {
    [key: string]: boolean;
  }

  /**
   * @deprecated use Manifest instead
   */
  interface Package {
    _id?: string;
    name: string;
    versions: Versions;
    'dist-tags': GenericBody;
    time: GenericBody;
    readme?: string;
    users?: PackageUsers;
    _distfiles: DistFiles;
    _attachments: AttachMents;
    _uplinks: UpLinks;
    _rev: string;
  }

  interface Manifest {
    _id?: string;
    name: string;
    versions: Versions;
    'dist-tags': GenericBody;
    time: GenericBody;
    readme?: string;
    users?: PackageUsers;
    _distfiles: DistFiles;
    _attachments: AttachMents;
    _uplinks: UpLinks;
    _rev: string;
  }

  interface IUploadTarball extends PassThrough {
    abort(): void;
    done(): void;
  }

  interface IReadTarball extends PassThrough {
    abort(): void;
  }

  interface UpLinkTokenConf {
    type: 'Bearer' | 'Basic';
    token?: string;
    token_env?: boolean | string;
  }

  interface UpLinkConf {
    url: string;
    ca?: string;
    cache?: boolean;
    timeout?: string | void;
    maxage?: string | void;
    max_fails?: number | void;
    fail_timeout?: string | void;
    headers?: Headers;
    auth?: UpLinkTokenConf;
    strict_ssl?: boolean | void;
    _autogenerated?: boolean;
  }

  interface AuthPluginPackage {
    packageName: string;
    packageVersion?: string;
    tag?: string;
  }

  interface PackageAccess {
    storage?: string;
    publish?: string[];
    proxy?: string[];
    access?: string[];
    unpublish: string[];
  }

  // info passed to the auth plugin when a package is package is being published
  interface AllowAccess {
    name: string;
    version?: string;
    tag?: string;
  }

  interface AuthPackageAllow extends PackageAccess, AllowAccess {}

  interface PackageList {
    [key: string]: PackageAccess;
  }

  interface UpLinksConfList {
    [key: string]: UpLinkConf;
  }

  type LoggerType = 'stdout' | 'stderr' | 'file';
  type LoggerFormat = 'pretty' | 'pretty-timestamped' | 'file';
  type LoggerLevel = 'http' | 'fatal' | 'warn' | 'info' | 'debug' | 'trace';

  interface LoggerConfItem {
    type: LoggerType;
    format: LoggerFormat;
    level: LoggerLevel;
  }

  interface PublishOptions {
    allow_offline: boolean;
  }

  type AuthConf = any | AuthHtpasswd;

  interface AuthHtpasswd {
    file: string;
    max_users: number;
  }

  // FUTURE: rename to Notification
  interface Notifications {
    method: string;
    packagePattern: RegExp;
    packagePatternFlags: string;
    endpoint: string;
    content: string;
    headers: Headers;
  }

  type Notification = Notifications;

  interface Token {
    user: string;
    token: string;
    key: string;
    cidr?: string[];
    readonly: boolean;
    created: number | string;
    updated?: number | string;
  }

  interface TokenFilter {
    user: string;
  }

  type IPackageStorage = ILocalPackageManager | undefined;
  type IPackageStorageManager = ILocalPackageManager;
  type IPluginStorage<T> = ILocalData<T>;

  interface AuthHtpasswd {
    file: string;
    max_users: number;
  }

  interface ILocalStorage {
    add(name: string): void;
    remove(name: string): void;
    get(): StorageList;
    sync(): void;
  }

  interface ListenAddress {
    [key: string]: string;
  }
  interface HttpsConfKeyCert {
    key: string;
    cert: string;
    ca?: string;
  }

  interface HttpsConfPfx {
    pfx: string;
    passphrase?: string;
  }

  type HttpsConf = HttpsConfKeyCert | HttpsConfPfx;

  interface JWTOptions {
    sign: JWTSignOptions;
    verify: JWTVerifyOptions;
  }

  interface JWTVerifyOptions {
    algorithm?: string;
    expiresIn?: string;
    notBefore?: string | number;
    ignoreExpiration?: boolean;
    maxAge?: string | number;
    clockTimestamp?: number;
  }

  interface JWTSignOptions {
    algorithm?: string;
    expiresIn?: string;
    notBefore?: string;
    ignoreExpiration?: boolean;
    maxAge?: string | number;
    clockTimestamp?: number;
  }

  interface APITokenOptions {
    legacy: boolean;
    jwt?: JWTOptions;
  }

  interface Security {
    web: JWTOptions;
    api: APITokenOptions;
  }

  export type FlagsConfig = {
    searchRemote?: boolean;
    changePassword?: boolean;
  };

  export type RateLimit = {
    windowMs: number;
    max: number;
  };

  export type ServerSettingsConf = {
    // express-rate-limit settings
    rateLimit: RateLimit;
    keepAliveTimeout?: number;
    // force http2 if https is defined
    http2?: boolean;
  };

  type URLPrefix = {
    // if is false, it would be relative by default
    absolute: boolean;
    // base path
    // eg: absolute: true, https://somedomain.com/xxx/
    // eg: absolute: false, /xxx/ (default) if url_prefix is an string instead an object
    basePath: string;
  };

  interface ConfigYaml {
    _debug?: boolean;
    storage?: string | void;
    packages: PackageList;
    uplinks: UpLinksConfList;
    // FUTURE: log should be mandatory
    log?: LoggerConfItem;
    web?: WebConf;
    auth?: AuthConf;
    security: Security;
    publish?: PublishOptions;
    store?: any;
    listen?: ListenAddress;
    https?: HttpsConf;
    http_proxy?: string;
    plugins?: string | void;
    https_proxy?: string;
    no_proxy?: string;
    max_body_size?: string;
    notifications?: Notifications;
    notify?: Notifications | Notifications[];
    middlewares?: any;
    filters?: any;
    url_prefix?: string;
    server?: ServerSettingsConf;
    flags?: FlagsConfig;
  }

  interface ConfigRuntime extends ConfigYaml {
    config_path: string;
  }

  interface Config extends ConfigYaml, ConfigRuntime {
    user_agent: string;
    server_id: string;
    secret: string;
    // deprecated
    checkSecretKey(token: string): string;
    getMatchedPackagesSpec(storage: string): PackageAccess | void;
    [key: string]: any;
  }

  type PublisherMaintainer = {
    username: string;
    email: string;
  };

  type SearchPackageBody = {
    name: string;
    scope: string;
    description: string;
    author: string | PublisherMaintainer;
    version: string;
    keywords: string | string[] | undefined;
    date: string;
    links?: {
      npm: string; // only include placeholder for URL eg: {url}/{packageName}
      homepage?: string;
      repository?: string;
      bugs?: string;
    };
    publisher?: any;
    maintainers?: PublisherMaintainer[];
  };

  interface ConfigWithHttps extends Config {
    https: HttpsConf;
  }

  export interface ITokenActions {
    saveToken(token: Token): Promise<any>;
    deleteToken(user: string, tokenKey: string): Promise<any>;
    readTokens(filter: TokenFilter): Promise<Token[]>;
  }

  /**
   * @deprecated use @verdaccio/core pluginUtils instead
   */
  interface ILocalData<T> extends IPlugin<T>, ITokenActions {
    logger: Logger;
    config: T & Config;
    add(name: string): Promise<void>;
    remove(name: string): Promise<void>;
    get(): Promise<any>;
    init(): Promise<void>;
    getSecret(): Promise<string>;
    setSecret(secret: string): Promise<any>;
    getPackageStorage(packageInfo: string): IPackageStorage;
  }

  type StorageUpdateCallback = (data: Package, cb: CallbackAction) => void;
  type StorageUpdateHandler = (name: string, cb: StorageUpdateCallback) => void;
  type StorageWriteCallback = (name: string, json: Package, callback: Callback) => void;
  type PackageTransformer = (pkg: Package) => Package;
  type ReadPackageCallback = (err: any | null, data?: Package) => void;

  interface ILocalPackageManager {
    logger: Logger;
    // @deprecated use writeTarballNext
    writeTarball(pkgName: string): IUploadTarball;
    // @deprecated use readTarballNext
    readTarball(pkgName: string): IReadTarball;
    readPackage(fileName: string, callback: ReadPackageCallback): void;
    createPackage(pkgName: string, value: Package, cb: CallbackAction): void;
    deletePackage(fileName: string): Promise<void>;
    removePackage(): Promise<void>;
    // @deprecated use updatePackageNext
    updatePackage(
      pkgFileName: string,
      updateHandler: StorageUpdateCallback,
      onWrite: StorageWriteCallback,
      transformPackage: PackageTransformer,
      onEnd: Callback
    ): void;
    // @deprecated use savePackageNext
    savePackage(fileName: string, json: Package, callback: CallbackAction): void;
    //  next packages migration (this list is meant to replace the callback parent functions)
    updatePackageNext(
      packageName: string,
      handleUpdate: (manifest: Manifest) => Promise<Package>
    ): Promise<Manifest>;
    savePackageNext(pkgName: string, value: Manifest): Promise<void>;
    readTarballNext(pkgName: string, { signal }): Promise<Readable>;
    writeTarballNext(tarballName: string, { signal }): Promise<Writable>;
    hasFile(fileName: string): Promise<boolean>;
  }

  interface TarballActions {
    addTarball(name: string, filename: string): IUploadTarball;
    getTarball(name: string, filename: string): IReadTarball;
    removeTarball(name: string, filename: string, revision: string, callback: Callback): void;
  }

  interface StoragePackageActions extends TarballActions {
    addVersion(
      name: string,
      version: string,
      metadata: Version,
      tag: StringValue,
      callback: Callback
    ): void;
    mergeTags(name: string, tags: MergeTags, callback: Callback): void;
    removePackage(name: string, callback: Callback): void;
    changePackage(name: string, metadata: Package, revision: string, callback: Callback): void;
  }

  // @deprecated use IBasicAuth from @verdaccio/auth
  interface IBasicAuth<T> {
    config: T & Config;
    aesEncrypt(buf: string): string;
    authenticate(user: string, password: string, cb: Callback): void;
    changePassword(user: string, password: string, newPassword: string, cb: Callback): void;
    allow_access(pkg: AuthPluginPackage, user: RemoteUser, callback: Callback): void;
    add_user(user: string, password: string, cb: Callback): any;
  }

  export interface Plugin<T> {
    new (config: T, options: PluginOptions<T>): T;
  }

  interface IPlugin<T> {
    version?: string;
    // In case a plugin needs to be cleaned up/removed
    close?(): void;
  }

  interface PluginOptions<T> {
    config: T & Config;
    logger: Logger;
  }

  // FIXME: error should be export type `VerdaccioError = HttpError & { code: number };`
  // instead of AuthError
  // but this type is on @verdaccio/core and cannot be used here yet (I don't know why)
  interface HttpError extends Error {
    status: number;
    statusCode: number;
    expose: boolean;
    headers?: {
      [key: string]: string;
    };
    [key: string]: any;
  }

  type AuthError = HttpError & { code: number };
  type AuthAccessCallback = (error: AuthError | null, access: boolean) => void;
  type AuthCallback = (error: AuthError | null, groups: string[] | false) => void;

  interface IPluginAuth<T> extends IPlugin<T> {
    authenticate(user: string, password: string, cb: AuthCallback): void;
    adduser?(user: string, password: string, cb: AuthCallback): void;
    changePassword?(user: string, password: string, newPassword: string, cb: AuthCallback): void;
    allow_publish?(user: RemoteUser, pkg: T & AuthPackageAllow, cb: AuthAccessCallback): void;
    allow_access?(user: RemoteUser, pkg: T & PackageAccess, cb: AuthAccessCallback): void;
    allow_unpublish?(user: RemoteUser, pkg: T & AuthPackageAllow, cb: AuthAccessCallback): void;
    allow_publish?(
      user: RemoteUser,
      pkg: AllowAccess & PackageAccess,
      cb: AuthAccessCallback
    ): void;
    allow_access?(user: RemoteUser, pkg: AllowAccess & PackageAccess, cb: AuthAccessCallback): void;
    allow_unpublish?(
      user: RemoteUser,
      pkg: AllowAccess & PackageAccess,
      cb: AuthAccessCallback
    ): void;
    apiJWTmiddleware?(helpers: any): Function;
  }

  // @deprecated use @verdaccio/server
  interface IPluginMiddleware<T> extends IPlugin<T> {
    register_middlewares(app: any, auth: IBasicAuth<T>, storage: any): void;
  }

  interface IPluginStorageFilter<T> extends IPlugin<T> {
    filter_metadata(packageInfo: Package): Promise<Package>;
  }

  export type SearchResultWeb = {
    name: string;
    version: string;
    description: string;
  };
}
