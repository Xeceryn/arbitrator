export const NotFoundPage = () => {
    return (
        <div class="my-auto  bg-base-100">
            <div class="hero">
                <div class="hero-content text-center">
                    <div class="max-w-md">
                        <h1 class="text-9xl font-bold text-error">404</h1>
                        <p class="py-6 text-2xl">Oops! Page not found</p>
                        <p class="pb-6">
                            The page you're looking for doesn't exist or has
                            been moved.
                        </p>
                        <a href="/" class="btn btn-primary mr-2">
                            Go Home
                        </a>
                        <button onclick="history.back()" class="btn btn-ghost">
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const InternalServerErrorPage = () => {
    return (
        <div class="my-auto  bg-base-100">
            <div class="hero">
                <div class="hero-content text-center">
                    <div class="max-w-md">
                        <h1 class="text-9xl font-bold text-error">500</h1>
                        <p class="py-6 text-2xl">Internal Server Error</p>
                        <p class="pb-6">An unexpected error occurred.</p>
                        <a href="/" class="btn btn-primary mr-2">
                            Go Home
                        </a>
                        <button onclick="history.back()" class="btn btn-ghost">
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
