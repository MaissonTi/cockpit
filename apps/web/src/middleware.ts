import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ["/auth/signin", "/auth/register"];

const redirectRoutes = ['/api/auth/signin?error=Callback']

export default withAuth(
    async function middleware(req: NextRequest) {

        const { pathname } = req.nextUrl;
        if (publicRoutes.includes(pathname)) {
            return NextResponse.next();
        }

        //console.log(pathname)
        if(redirectRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL("/auth/signin", req.url));
        }

        //console.log('req.nextauth', req.nextauth)

        // const res = await fetch("http://localhost:3333/sessions", {
        //   method: 'GET',
        //   headers: {
        //     "Content-Type": "application/json" ,
        //     "Authorization": `Bearer ${req.nextauth.token?.accessToken}`
        //   }
        // })
        // const result = await res.json()

        // if (!result.sub) {
        //     return NextResponse.redirect(new URL("/auth/signin", req.url));
        // }
        return NextResponse.next();
    },
    {
      pages: {
        signIn: "/auth/signin",
        error: "/auth/signin",
      },
      callbacks: {
          authorized: ({ token }) => {
            //console.log("authorized",token)
            return !!token
          },
      },
      secret: process.env.AUTH_SECRET,
    }
);

export const config = {
    matcher: [
    //"/((?!_next|api|images|favicon.ico).*)",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    ],

};


