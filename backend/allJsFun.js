export function navAndInsert(arr, points, newItem) {
    if (points.length == 1) {
        const title = points[0].split('~')[0];
        const quad = points[0].split('~')[1];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].title == title) {
                arr[i][quad].push(newItem);
                return;
            }
        }
    } else {
        const title = points[0].split('~')[0];
        const quad = points[0].split('~')[1];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].title == title) {
                points.shift();
                return navAndInsert(arr[i][quad], points, newItem);
            }
        }
    }
}

export function getAllTitles(obj, title) {
    const iU = [];
    for (let i = 0; i < obj.iu.length; i++) {
        iU.push(obj.iu[i].title);
    }

    const iN = [];
    for (let i = 0; i < obj.in.length; i++) {
        iN.push(obj.in[i].title);
    }

    const nU = [];
    for (let i = 0; i < obj.nu.length; i++) {
        nU.push(obj.nu[i].title);
    }

    const nN = [];
    for (let i = 0; i < obj.nn.length; i++) {
        nN.push(obj.nn[i].title);
    }

    return {
        title: title,
        iU: iU,
        iN: iN,
        nU: nU,
        nN: nN
    }
}

export function navAndGet(arr, points) {
    if(arr != null && arr != undefined) {
        if (points.length == 1) {
            if (points[0].split('~').length == 1) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].title == points[0]) {
                        const result = getAllTitles(arr[i], arr[i].title);
                        return result;
                    }
                }
            }
        } else {
            const title = points[0].split('~')[0];
            const quad = points[0].split('~')[1];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].title == title) {
                    points.shift();
                    return navAndGet(arr[i][quad], points);
                }
            }
        }
    }
}

export function navAndUpdate(arr, points, newTitle) {
    if (points.length == 1) {
        if (points[0].split('~').length == 1) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].title == points[0]) {
                    arr[i].title = newTitle;
                    return;
                }
            }
        }
    } else {
        const title = points[0].split('~')[0];
        const quad = points[0].split('~')[1];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].title == title) {
                points.shift();
                return navAndUpdate(arr[i][quad], points, newTitle);
            }
        }
    }
}

export function navAndDelete(arr, points) {
    if (points.length == 1) {
        if (points[0].split('~').length == 1) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].title == points[0]) {
                    arr.splice(i,1);
                    return;
                }
            }
        }
    } else {
        const title = points[0].split('~')[0];
        const quad = points[0].split('~')[1];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].title == title) {
                points.shift();
                return navAndDelete(arr[i][quad], points);
            }
        }
    }
}