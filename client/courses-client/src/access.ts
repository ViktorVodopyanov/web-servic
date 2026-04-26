export default function access(initialState: any) {
    const isAuthenticated = !!initialState?.currentUser;

    return {
        canAccessProtected: isAuthenticated,
    };
}