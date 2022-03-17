interface ApiResponse {
    statusCode: number
    body: string
}
const isOk = (r: ApiResponse): boolean => {
    return r.statusCode === 200 || r.statusCode === 201
}
export { ApiResponse, isOk }