
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export const fetchNearByIssues = ({ pageParam, queryKey }) => {
    return axios.get(
        `${BACKEND_URL}/issue/get?latitude=${parseFloat(queryKey[1])}&longitude=${
            queryKey[2]
        }&page=${pageParam}&search=${queryKey[3]}`,
        { withCredentials: true }
    );
};

export const fetchIssuesByOffice = ({ pageParam, queryKey }) => {
    return axios.get(`${BACKEND_URL}/issue/office?office=${queryKey[1]}&page=${pageParam}&search=${queryKey[2]}`, {
        withCredentials: true,
    });
};

export const fetchIssueByAuthority = async ({ pageParam, queryKey }) => {
    return axios.get(`${BACKEND_URL}/issue/authority?page=${pageParam}&search=${queryKey[1]}`, {
        withCredentials: true,
    });
};
export const fetchForwardedissues = async ({ pageParam, queryKey }) => {
    return axios.get(`${BACKEND_URL}/issue/forwarded?page=${pageParam}&search=${queryKey[1]}`, {
        withCredentials: true,
    });
};
export const fetchConflictIssues = async ({ pageParam, queryKey }) => {
    return axios.get(`${BACKEND_URL}/issue/conflict?page=${pageParam}&search=${queryKey[1]}`, {
        withCredentials: true,
    });
};

export const sendIssue = (issue) => {
    return axios.post(`${BACKEND_URL}/issue`, issue, {
        headers: {
            "Content-Type": "multipart/form-data",      
        },
        withCredentials: true,
    });
};

export const userSignUp = (user) => {
    return axios.post(`${BACKEND_URL}/auth/usersignup`, user, { withCredentials: true });
};
export const authoritySignUp = (user) => {
    return axios.post(`${BACKEND_URL}/auth/authoritysignup`, user, { withCredentials: true });
};

export const fetchIssueById = async ({ queryKey }) => {
    const res = await axios.get(`${BACKEND_URL}/issue/${queryKey[1]}`, { withCredentials: true });
    return res.data.issue;
};

export const forwardIssue = async (body) => {
    //console.log(issueId,department,role)
    return axios.put(`${BACKEND_URL}/issue/forward`, body, { withCredentials: true });
};

export const updateIssue = (body) => {
    return axios.put(`${BACKEND_URL}/issue/update`, body, { withCredentials: true });
};

export const getUser = async () => {
    const res = await axios.get(`${BACKEND_URL}/auth`, { withCredentials: true });
    return res.data.user;
};

export const confirmResolution = async (body) => {
    return axios.put(`${BACKEND_URL}/issue/confirmresolution`, body, { withCredentials: true });
};
export const rejectResolution = async (body) => {
    return axios.put(`${BACKEND_URL}/issue/rejectresolution`, body, { withCredentials: true });
};

export const upVote = async (body) => {
    return axios.put(`${BACKEND_URL}/issue/upvote`, body, { withCredentials: true });
};
export const unUpVote = async (body) => {
    return axios.put(`${BACKEND_URL}/issue/unupvote`, body, { withCredentials: true });
};

export const getAnalytics = async ({ queryKey }) => {
    const res = await axios.get(`${BACKEND_URL}/issue/analytics?fromDate=${queryKey[1]}&toDate=${queryKey[2]}&type=${queryKey[3]}`, {
        withCredentials: true,
    });
    return res.data;
};

export const getAuthorities = async () => {
    const res = await axios.get(`${BACKEND_URL}/auth/authorities`, { withCredentials: true });
    return res.data.authorities;
};
