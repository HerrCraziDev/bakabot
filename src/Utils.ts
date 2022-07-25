

export async function awaitAll(values: Iterable<any>, caller: (v: any) => Promise<any>) {
    let promises: Array<Promise<any>> = [];

    for (const v of values) {
        promises.push(caller(v));
    }

    return await Promise.allSettled(promises);
}

export function throttle(callback: () => void, limit: number) {
    var waiting = false;
    var need_last_run = false;
    return function () {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(() => {
                waiting = false;
                if (need_last_run) {
                    callback.apply(this, arguments);
                    need_last_run = false;
                }
            }, limit);
        } else {
            need_last_run = true;
        }
    };
}