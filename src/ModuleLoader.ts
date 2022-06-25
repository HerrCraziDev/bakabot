import { BaseModule, Module } from "./Module";
import { Ping } from "./modules/Ping";
import { TimeUpdater } from "./modules/TimeUpdater";
import { VideoGrabber } from "./modules/VideoGrabber";

export const modules: Array<any> = [
    // TimeUpdater,
    // VideoGrabber,
    Ping
]