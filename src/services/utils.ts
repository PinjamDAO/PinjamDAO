// because .json crashes and burns if you dont have a body
export async function extractBody(request: Request): Promise<any> {
    let ret = {}
    try {
        ret = await request.json()
    } catch (e) {
        console.log(':(')
     }
    return ret
}

// truncates a decimal value to a fixed number of decimal places
// prevents ethers function from shitting itself (because it doesnt know how to round down LOL)
export function truncateDecimals(value: string, places: number) {
    return parseFloat(value).toFixed(places)
}