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