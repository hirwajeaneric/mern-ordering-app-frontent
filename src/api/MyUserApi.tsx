import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

/**
 * The base URL for the API.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


/**
 * Gets the current user from the API.
 */
export const useGetMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyUserRequest = async (): Promise<User> => {
        const accesstoken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            headers: {
                Authorization: `Bearer ${accesstoken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        return response.json();
    }

    const { data: currentUser, isLoading, error } = useQuery("fetchCurrentUser", getMyUserRequest);

    if (error) {
        toast.error(error.toString());
    }

    return { currentUser, isLoading };
}

/**
 * Type definition for the request payload when creating a user.
 */
type CreateUserRequest = {
    /**
     * The unique identifier for the user in Auth0.
     */
    auth0Id: string;
    email: string;
}

/**
 * Custom hook to create a new user.
 *
 * @returns An object containing the `createUser` function, as well as
 * `isLoading`, `isError`, and `isSuccess` boolean flags indicating the
 * current state of the mutation.
 */
export const useCreateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    /**
     * Asynchronous function to create a new user.
     *
     * @param {CreateUserRequest} user - The user object to be created.
     * @returns A Promise that resolves when the user is successfully created.
     */
    const createMyUserRequest = async (user: CreateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error("Failed to create user");
        }
    };

    const { mutateAsync: createUser, isLoading, isError, isSuccess } = useMutation(createMyUserRequest);

    return {
        createUser,
        isLoading,
        isError,
        isSuccess,
    };
};

/**
 * Type definition for the request payload when updating a user.
 */
type UpdateMyUserRequest = {
    name: string;
    addressLine1: string;
    city: string;
    country: string;
}

/**
 * Custom hook to update a user.
 *
 * @returns An object containing the `updateUser` function, as well as
 * `isLoading` boolean flag indicating the current state of the mutation.
 */
export const useUpdateMyUser =  () => {
    const { getAccessTokenSilently } = useAuth0();

    /**
     * Asynchronous function to update a user.
     *
     * @param {UpdateMyUserRequest} formData - The user object to be updated.
     * @returns A Promise that resolves when the user is successfully updated.
     */
    const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error("Failed to update user");
        }
    };

    const { mutateAsync: updateUser, isLoading, isSuccess, error, reset } = useMutation(updateMyUserRequest);
    
    if (isSuccess) {
        toast.success("User profile updated!");
    }

    if (error) {
        toast.error(error.toString());
        reset();
    }

    return {
        updateUser,
        isLoading,
    };
}