import { Request } from "express"

export type ExtendRequest = Request & {
    userSlug?: string
}