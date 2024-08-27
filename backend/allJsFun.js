export function navAndInsert(arr, points, newItem, index=null) {
    if (index == null) {
        if (points.length == 1) {
            const slug = points[0].split('~')[0];
            const quad = points[0].split('~')[1];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].slug == slug) {
                    for(let j = 0; j < arr[i][quad].length; j++) {
                        if(arr[i][quad][j].slug == newItem.slug) {
                            return false;
                        }
                    }
                    arr[i][quad].push(newItem);
                    return true;
                }
            }
        } else {
            const slug = points[0].split('~')[0];
            const quad = points[0].split('~')[1];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].slug == slug) {
                    points.shift();
                    return navAndInsert(arr[i][quad], points, newItem);
                }
            }
        }
    } else {
        if (points.length == 1) {
            const slug = points[0].split('~')[0];
            const quad = points[0].split('~')[1];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].slug == slug) {
                    for(let j = 0; j < arr[i][quad].length; j++) {
                        if(arr[i][quad][j].slug == newItem.slug) {
                            return false;
                        }
                    }
                    arr[i][quad].splice(index, 0, newItem);
                    return true;
                }
            }
        } else {
            const slug = points[0].split('~')[0];
            const quad = points[0].split('~')[1];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].slug == slug) {
                    points.shift();
                    return navAndInsert(arr[i][quad], points, newItem, index);
                }
            }
        }
    }
}

export function getAllTitles(obj) {
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
        title: obj.title || 'home',
        slug: obj.slug || 'home',
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
                    if (arr[i].slug == points[0]) {
                        const result = getAllTitles(arr[i]);
                        return result;
                    }
                }
            }
        } else {
            const slug = points[0].split('~')[0];
            const quad = points[0].split('~')[1];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].slug == slug) {
                    points.shift();
                    return navAndGet(arr[i][quad], points);
                }
            }
        }
    }
}

export function navAndUpdate(arr, points, index, newTitle, newSlug) {
    if (points.length == 1) {
        const slug = points[0].split('~')[0];
        const quad = points[0].split('~')[1];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].slug == slug) {
                for(let j = 0; j < arr[i][quad].length ; j++) {
                    if(arr[i][quad][j].slug == newSlug) {
                        return false;
                    }
                }
                arr[i][quad][index].title = newTitle;
                arr[i][quad][index].slug = newSlug;
                return true;
            }
        }
    } else {
        const slug = points[0].split('~')[0];
        const quad = points[0].split('~')[1];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].slug == slug) {
                points.shift();
                return navAndInsert(arr[i][quad], points, index, newTitle, newSlug);
            }
        }
    }
}

export function navAndDelete(arr, points, index) {
    if (points.length == 1) {
        const slug = points[0].split('~')[0];
        const quad = points[0].split('~')[1];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].slug == slug) {
                let deletedItem = arr[i][quad].splice(index,1);
                return deletedItem;
            }
        }
    } else {
        const slug = points[0].split('~')[0];
        const quad = points[0].split('~')[1];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].slug == slug) {
                points.shift();
                return navAndInsert(arr[i][quad], points, index);
            }
        }
    }
}