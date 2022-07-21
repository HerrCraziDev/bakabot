import { BaseModule, Module } from "./Module";
import { Leaderboard } from "./modules/Leaderboard";
import { Ping } from "./modules/Ping";
import { TimeUpdater } from "./modules/TimeUpdater";
import { VideoGrabber } from "./modules/VideoGrabber";

export const modules: Array<any> = [
    Ping,
    // TimeUpdater,
    // VideoGrabber,
    Leaderboard
]