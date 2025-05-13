"use client"

export const fetchClient = async (input: string | URL | Request, accessToken: string | undefined, init?: RequestInit | undefined) : Promise<Response> => {
    const response = await fetch(input, {
        ...init,
        headers: {
            ...init?.headers,
            ...(accessToken && { Authorization: `Bearer ${accessToken}`})
        }
    })

    return response;
}