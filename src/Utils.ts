

export async function awaitAll(values: Iterable<any>, caller: (v: any) => Promise<any>) {
    let promises: Array<Promise<any>> = [];

    for (const v of values) {
        promises.push(caller(v));
    }

    return await Promise.allSettled(promises);
}