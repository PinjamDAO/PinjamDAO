// because .json crashes and burns if you dont have a body
export function extractBody(request: Request): any {
    let ret = {}
    try {
        ret = request.json()
    } catch (e) {
        console.log(':(')
     }
    return ret
}