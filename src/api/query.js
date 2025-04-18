import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    authoritySignUp,
    confirmResolution,
    fetchConflictIssues,
    fetchForwardedissues,
    fetchIssueByAuthority,
    fetchIssueById,
    fetchIssuesByOffice,
    fetchNearByIssues,
    forwardIssue,
    getAnalytics,
    getAuthorities,
    getUser,
    rejectResolution,
    sendIssue,
    unUpVote,
    updateIssue,
    upVote,
    userSignUp,
} from "./index";
import { useNavigate } from "react-router-dom";

export const useFetchNearByIssues = (latitude, longitude, search) => {
    const queryClient = useQueryClient();
    const query = useInfiniteQuery({
        queryKey: ["nearByIssues", latitude, longitude, search],
        queryFn: fetchNearByIssues,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.data.pagination;
            return pagination.page < pagination.totalPages ? pagination.page + 1 : null;
        },
    });

    const updateUpVote = (issueId, type) => {
        console.log("Yess");
        queryClient.setQueryData(["nearByIssues", latitude, longitude, search], (oldData) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    data: {
                        ...page.data,
                        issues: page.data.issues.map((issue) => {
                            if (issue === issueId) {
                                if (type === "upvote")
                                    return { ...issue, upVotes: [...issue.upVotes, { id: issueId }] };
                                return { ...issue, upVotes: issue.upVotes.filter((up) => up.id !== issueId) };
                            }
                            return issue;
                        }),
                    },
                })),
            };
        });
    };

    // const getData = () => {
    //     return queryClient.getQueryData(["nearByIssues", latitude,longitude, search])
    // }

    return {
        ...query,
        updateUpVote,
    };
};
export const useFetchIssuesByOffice = (officeId, search) => {
    const queryClient = useQueryClient();
    const query = useInfiniteQuery({
        queryKey: ["OfficeIssues", officeId, search],
        queryFn: fetchIssuesByOffice,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.data.pagination;
            return pagination.page < pagination.totalPages ? pagination.page + 1 : null;
        },
    });

    const removeIssueFromCache = (issueId) => {
        queryClient.setQueryData(["OfficeIssues", officeId, search], (oldData) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    data: {
                        ...page.data,
                        issues: page.data.issues.filter((issue) => issue.id !== issueId),
                    },
                })),
            };
        });
    };

    return {
        ...query,
        removeIssueFromCache,
    };
};

export const useFetchIssue = (id) => {
    return useQuery({
        queryKey: ["getIssue", id],
        queryFn: fetchIssueById,
    });
};

export const useUpvoteIssue = () => {
    return useMutation({
        mutationFn: async ({ issueId, action }) => {
            const response = await fetch(`/api/issues/${issueId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            if (!response.ok) throw new Error("Failed to update vote");
            return response.json();
        },
    });
};
export const useSendIssue = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (issue) => sendIssue(issue),
        onSuccess: (data) => {
            // Invalidate and refetch related queries
            //queryClient.invalidateQueries({ queryKey: ['issues'] });
            // You might want to add a success notification here
            navigate("/");
        },
        onError: (error) => {
            // Handle errors appropriately
            console.error("Failed to send issue:", error);
            // You might want to add an error notification here
        },
    });
};
export const useUserSignup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user) => userSignUp(user),
    });
};
export const useAuthoritySignup = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (user) => authoritySignUp(user),
        onSuccess: (data, variables) => {
            navigate("/verify-otp", {
                state: {
                    credential: variables.email || "your",
                    type: "email",
                },
            });
        },
        onError: (error) => {
            console.error("Failed to send issue:", error);
        },
    });
};

export const useFetchIssuesByAuthority = (search) => {
    const queryClient = useQueryClient();

    const query = useInfiniteQuery({
        queryKey: ["AuthorityIssues", search],
        queryFn: fetchIssueByAuthority,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.data.pagination;
            return pagination.page < pagination.totalPages ? pagination.page + 1 : null;
        },
    });

    const updateIssueInCache = (issueId, status) => {
        queryClient.setQueryData(["AuthorityIssues", search], (oldData) => {
            if (!oldData) return oldData;
            console.log(oldData);
            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    data: {
                        ...page.data,
                        issues: page.data.issues.map((issue) => {
                            if (issue.id === issueId) {
                                return {
                                    ...issue,
                                    status: status,
                                };
                            }
                            return issue;
                        }),
                    },
                })),
            };
        });
    };

    return {
        ...query,
        updateIssueInCache,
    };
};
export const useFetchForwardedIssues = (search) => {
    const queryClient = useQueryClient();

    const query = useInfiniteQuery({
        queryKey: ["ForwardedIssues", search],
        queryFn: fetchForwardedissues,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.data.pagination;
            return pagination.page < pagination.totalPages ? pagination.page + 1 : null;
        },
    });

    const removeIssueFromCache = (issueId) => {
        queryClient.setQueryData(["ForwardedIssues", search], (oldData) => {
            if (!oldData) return oldData;
            console.log(oldData);
            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    data: {
                        ...page.data,
                        issues: page.data.issues.filter((issue) => issue.id !== issueId),
                    },
                })),
            };
        });
    };

    return {
        ...query,
        removeIssueFromCache,
    };
};
export const useFetchConflictIssues = (search) => {
    const queryClient = useQueryClient();

    const query = useInfiniteQuery({
        queryKey: ["ConflictIssues", search],
        queryFn: fetchConflictIssues,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.data.pagination;
            return pagination.page < pagination.totalPages ? pagination.page + 1 : null;
        },
    });

    const removeIssueFromCache = (issueId) => {
        queryClient.setQueryData(["ConflictIssues", search], (oldData) => {
            if (!oldData) return oldData;
            console.log(oldData);
            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    data: {
                        ...page.data,
                        issues: page.data.issues.filter((issue) => issue.id !== issueId),
                    },
                })),
            };
        });
    };

    return {
        ...query,
        removeIssueFromCache,
    };
};

export const useForwardIssue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ issueId, role, department }) => forwardIssue({ issueId, role, department }),

        onSuccess: (data, variables) => {
            // Invalidate to ensure cache is up to date
            queryClient.invalidateQueries({ queryKey: ["ForwardedIssues"] });
        },

        onError: (error, variables, context) => {
            console.error("Failed to forward issue:", error);
            // Rollback to the previous state if mutation fails
            if (context?.previousIssues) {
                queryClient.setQueryData(["ForwardedIssues"], context.previousIssues);
            }
        },
    });
};

export const useUpdateIssue = () => {
    return useMutation({
        mutationFn: (body) => updateIssue(body),
        onSuccess: (data) => {
            // Invalidate to ensure cache is up to date
            //  queryClient.invalidateQueries({ queryKey: ['issues'] });
        },
        onError: (error) => {
            console.error("Failed to update issue:", error);
        },
    });
};

export const useFetchUser = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        //staleTime: 1000 * 60 * 3,
    });

    const removeFromCache = (id) => {
        queryClient.setQueryData(["user"], (old) => {
            if (!old) return old;
            return {
                ...old,
                Notifications: old.Notifications.filter((noti) => noti.id !== id),
            };
        });
    };

    const upDateUpVote = (issueId, type) => {
        if (type == "upvote") {
            queryClient.setQueryData(["user"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    upVoted: [...old.upVoted, { id: issueId }],
                };
            });
        } else {
            queryClient.setQueryData(["user"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    upVoted: old.upVoted.filter((up) => up.issueId !== issueId),
                };
            });
        }
    };

    return {
        ...query,
        removeFromCache,
        upDateUpVote,
    };
};

export const useConfirmResoultion = () => {
    return useMutation({
        mutationFn: (body) => confirmResolution(body),
    });
};
export const useRejectResoultion = () => {
    return useMutation({
        mutationFn: (body) => rejectResolution(body),
    });
};

export const useUpVote = () => {
    return useMutation({
        mutationFn: (body) => upVote(body),
    });
};
export const useUnUpVote = () => {
    return useMutation({
        mutationFn: (body) => unUpVote(body),
    });
};

export const useFetchAnalytics = (fromDate, toDate, type) => {
    return useQuery({
        queryKey: ["analytics", fromDate, toDate , type],
        queryFn: getAnalytics,
    });
};

export const useFetchAuthorities = () => {
    return useQuery({
        queryKey: ["authorities"],
        queryFn: getAuthorities,
        staleTime: 1000 * 60 * 30,
    });
};