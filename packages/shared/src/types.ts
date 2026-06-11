// User REgistrater Validation Type
export type RegisterValidationType = {
    name: string,
    email: string,
    password: string
}
export type checkOTPType = {
    email : string,
    otp : Number
}

export interface JWTPayload {
    userId : string
}