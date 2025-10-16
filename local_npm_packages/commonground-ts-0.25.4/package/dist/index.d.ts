import l from 'loglevel';
import { Buffer as Buffer$1 } from 'buffer';
import WebSocket from 'isomorphic-ws';
import EventEmitter$1, { EventEmitter } from 'eventemitter3';

declare const log: l.RootLogger;

type Vector3 = [number, number, number];
type Quaternion = [number, number, number, number];
type TransformUpdateObject = {
    id: number;
    pos: Vector3[];
    rot: Quaternion[];
    scale: Vector3[];
    highPrecision: boolean;
    transformParentId: number[];
    lastTransformUpdateTime: number;
};
declare enum AggregateType {
    NONE = 0,
    SUM = 1
}
declare const AggregateTypeNames: string[];
type PropertyInfo = {
    name: string;
    type: string;
    aggregate?: AggregateType | undefined;
};
type SimpleTransform = {
    position: Vector3;
    rotation: Quaternion;
    scale: Vector3;
};

declare enum Command {
    SetId = 1,
    RequestIdSpace = 2,
    AssignIdSpace = 3,
    Ready = 4,
    Ping = 5,
    Pong = 6,
    Time = 7,
    TypeInfo = 8,
    Delete = 12,
    Lock = 13,
    Unlock = 14,
    SetProperty = 15,
    SetOwner = 17,
    PeerMessage = 18,
    TransformUpdate = 20,
    Register = 21,
    BlobUpdate = 22,
    InvalidLegacyJsonMessage = 123,// coincidentally, '{', so sending a json text { will trigger this.
    LegacyJsonMessage = 254
}
declare class Message {
    static parse(msg: string): Message | undefined;
    cmd: Command;
    id: number;
    value: any;
    property: number | undefined;
    buffer: Buffer$1 | undefined;
    constructor(cmd: Command, id: number, value?: any, property?: number, buffer?: Buffer$1);
    getBuffer(): Buffer$1;
    toString(): string;
}

type FindObjectFunction = (id: number) => TransformUpdateObject | undefined;
type NotifyObjectFunction = (id: number, time: number, index: number, pos?: Vector3, rot?: Quaternion, scale?: Vector3) => void;
declare class NetworkReader {
    private buffer;
    private offset;
    constructor(buffer: Buffer, initialOffset?: number);
    bytesRemaining(): number;
    reset(): void;
    getRestOfBuffer(): Buffer;
    readBuffer(size: number): Buffer | null;
    readUint8(): number;
    readUint16(): number;
    readUint32(): number;
    readInt8(): number;
    readInt16(): number;
    readInt32(): number;
    readDouble(): number;
    readFloat(): number;
    tryReadString(): string | null;
    tryReadRestAsString(): string | null;
    readString(): string | null;
    readObjectId(): number;
    readClientId(): number;
    readVarUInt(): number;
    readVector3(): Vector3;
    readVarVector3Int(): Vector3;
    readQuaternion(): Quaternion;
    readVector3Compressed(last: Vector3): Vector3;
    readQuaternionCompressed(): Quaternion;
    readQuaternionCompressedHP(last: Quaternion): Quaternion;
    readMessage(): Message | undefined;
    readTransformUpdate(find: FindObjectFunction, notify?: NotifyObjectFunction): number;
    readTypeInfoMessage(): Message;
    readType(type: string): any;
}

declare class NetworkWriter {
    private buffer;
    private offset;
    constructor(buffer: Buffer$1);
    getSubBuffer(): Buffer$1;
    private ensureCapacity;
    getBytesWritten(): number;
    writeUint8(value: number): void;
    writeUint16(value: number): void;
    writeUint32(value: number): void;
    writeInt8(value: number): void;
    writeInt16(value: number): void;
    writeInt32(value: number): void;
    writeDouble(value: number): void;
    writeFloat(value: number): void;
    writeString(value: string): void;
    writeBuffer(value: Buffer$1): void;
    writeObjectId(value: number): void;
    writeClientId(value: number): void;
    writeVarUInt(value: number): void;
    writeVarInt(value: number): void;
    writeQuaternionCompressed(value: Quaternion): void;
    writeQuaternionCompressedHP(value: Quaternion): void;
    writeVector3Long(value: number[]): void;
    writeVarVector3Int(value: number[]): void;
    writeMessage(msg: Message): void;
    static calculateTransformUpdateMessageSize(objects: Map<number, TransformUpdateObject>): number;
    writeTransformUpdateMessage(clientId: number, time: number, objects: Map<number, TransformUpdateObject>): void;
    static calculateStringSize(value: string): number;
    static typeName_withAggregate(propertyInfo: PropertyInfo): string;
    static calculateTypeInfoMessageSize(name: string, properties: PropertyInfo[]): number;
    writeTypeInfoMessage(name: string, properties: PropertyInfo[]): void;
    writeType(type: string, v: any): any;
}

declare enum PersistenceLevel {
    Client = 0,
    Scene = 1,
    Session = 2,
    Persistent = 3
}
declare class Blob {
    size: number;
    buffer: Buffer;
    data: Buffer;
    static HEADER_SIZE: number;
    constructor(id: number, blobIndex: number, size: number);
    update(index: number, data: Buffer): void;
}
declare class SharedObject {
    id: number;
    name: string;
    typeName: string;
    linked: boolean;
    links: number;
    linkedName: string | undefined;
    properties: Map<number, any>;
    lockedBy: number | undefined;
    persistence: PersistenceLevel;
    owner: number | undefined;
    pos: Vector3[];
    scale: Vector3[];
    rot: Quaternion[];
    highPrecision: boolean;
    transformParentId: number[];
    lastTransformUpdateTime: number;
    blob: Blob[];
    constructor(id: number, name: string, typeName: string);
}

declare class NetworkObject extends SharedObject {
    owned: boolean;
    parent: NetworkObject | undefined;
    expand: boolean;
    children: {
        [key: string]: NetworkObject;
    };
    uid: string | undefined;
    destroy(): void;
    setProperty(index: number, key: string, value: any): void;
    setTransform(time: number, index: number, pos?: Vector3, rot?: Quaternion, scale?: Vector3): void;
    setParent(parent: NetworkObject): void;
    addChild(child: NetworkObject): void;
}

type ObjectFactory = (id: number, name: string, typeName: string, connection: NetworkConnection) => NetworkObject;
type PeerMessageHandler = (message: any) => void;
declare class NetworkConnection extends EventEmitter {
    readonly webSocketPath: string;
    connected: boolean;
    closing: boolean;
    lastError: string | undefined;
    myId: number | undefined;
    ready: boolean;
    time: number;
    myIdSpace: number;
    myIdSpaceMax: number;
    localPeerId: number;
    objects: Map<number, NetworkObject>;
    objectsByUid: Map<string, NetworkObject>;
    peers: {
        [id: number]: NetworkObject;
    };
    types: {
        [id: string]: PropertyInfo[];
    };
    typeIndex: {
        [id: string]: {
            [id: string]: number;
        };
    };
    socket: WebSocket;
    immediatelyUnlinkObjects: boolean;
    objectFactories: Map<string, ObjectFactory>;
    peerMessageHandlers: {
        [id: number]: PeerMessageHandler;
    };
    bufferedPeerMessages: {
        [id: number]: any;
    };
    constructor(webSocketPath: string);
    registerObjectFactory(typeName: string, factory: ObjectFactory): void;
    createObject(id: number, name: string, typeName: string, linked?: boolean): NetworkObject | undefined;
    objectAppearedHandlers: any;
    WhenObjectAppears(id: number, callback: any): void;
    ObjectAppeared(id: number, obj: NetworkObject): void;
    linkObject(id: number, type: string, typeName?: string | undefined): NetworkObject | undefined;
    deleteObject(id: number): void;
    lockObject(id: number, client: number): void;
    unlockObject(id: number, client: number): void;
    setProperty(id: number, property: number, value: any): void;
    handleTransformUpdate(msg: Message): void;
    handleRegister(msg: Message): NetworkObject | undefined;
    setObjectProperty(obj: NetworkObject, index: number, info: PropertyInfo, v: any): void;
    handleTypeInfo(msg: Message): void;
    registerType(name: string, properties: PropertyInfo[]): void;
    saveTypeRegistration(name: string, properties: PropertyInfo[]): void;
    setOwner(id: number, value: number): void;
    handle(msg: Message, socket: WebSocket): Promise<void>;
    connect(): void;
    reconnect(): void;
    close(): void;
    clear(): void;
    sendAndHandle(msg: Message): void;
    sendMessage(msg: Message): void;
    waitingForIdCallbacks: Array<(id: number) => void>;
    getNextId(cb: (id: number) => void): void;
    createRegisterMessage(obj: NetworkObject, sendTransformsAndProperties?: boolean): Message;
    createSetPropertyMessage(typeName: string, id: number, property: string, value: any): Message;
    sendTakeOwnershipMesssage(obj: NetworkObject): void;
    sendSetProperty(obj: NetworkObject, propertyName: string, value: any): void;
    createTypeInfoMessage(name: string, properties: PropertyInfo[]): Message;
    send_deleteObject(id: number, deleteLocally?: boolean): void;
    sendPeerMessage(id: number, message: any): void;
    registerPeerMessageHandler(id: number, handler: PeerMessageHandler): void;
    unregisterPeerMessageHandler(id: number): void;
    handlePeerMessage(id: number, m: string): Promise<void>;
}

declare class WebView extends NetworkObject {
    id: number;
    constructor(id: number, name: string, typeName: string);
    setProperty(index: number, key: string, value: any): void;
    static create(id: number, url: string, positioningMode?: number, width?: number, height?: number, transform?: SimpleTransform | undefined, role?: string | undefined): WebView;
    static TypeInfo: {
        name: string;
        type: string;
        aggregate: number;
    }[];
}

declare class ControlClient {
    connection: NetworkConnection;
    eventEmitter: EventEmitter$1;
    constructor(webSocketPath: string);
    on(eventName: string, listener: (...args: any[]) => void): this;
    close(): void;
    createPOIController(): void;
    createInvite(transform: SimpleTransform): void;
    createWebView(url: string, positioningMode?: number, width?: number, height?: number, transform?: SimpleTransform | undefined, role?: string | undefined): Promise<WebView>;
    deleteObject(o: NetworkObject): void;
    setTargetPoi(title: string): void;
    reloadPois(): void;
    setVisibility(visibility: string): void;
}

declare class HeadPositionClient {
    connection: NetworkConnection;
    eventEmitter: EventEmitter$1;
    constructor(webSocketPath: string);
    on(eventName: string, listener: (...args: any[]) => void): this;
    close(): void;
}

export { AggregateType, AggregateTypeNames, Blob, Command, ControlClient, HeadPositionClient, Message, NetworkConnection, NetworkObject, NetworkReader, NetworkWriter, type ObjectFactory, type PeerMessageHandler, PersistenceLevel, type PropertyInfo, type Quaternion, SharedObject, type SimpleTransform, type TransformUpdateObject, type Vector3, log };
