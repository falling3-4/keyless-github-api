import axios from "axios";

const BASE_URL = "https://github.com";

// github returns em tags in the response
const stripEm = (text?: string) =>
    text ? text.replace(/<\/?em>/gi, "") : text;

const GetReactBuilder = async (query: string): Promise<any> => {
    try {
        const page = await axios.get(query, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });

        const match = page.data.match(
            /<script type="application\/json" data-target="react-app\.embeddedData">([\s\S]*?)<\/script>/
        );

        if (!match) {
            console.log("oops @ GetReactBuilder: no match found");
            return {};
        }

        return JSON.parse(match[1]);
    } catch (err) {
        console.error("oops @ GetReactBuilder:", err);
        return {};
    }
};

const simplifyRepository = (repo: any) => ({
    id: repo.id,
    name: stripEm(repo.hl_name),
    description: stripEm(repo.hl_trunc_description),
    archived: repo.archived,
    public: repo.public,
    stars: repo.repo?.repository?.stargazerCount ?? 0,
    language: repo.language,
    topics: repo.topics ?? [],
});

const SearchRepositories = async (query: string): Promise<any[]> => {
    const data = await GetReactBuilder(
        `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=repositories`
    );

    if (data?.payload?.results) {
        return data.payload.results.map(simplifyRepository);
    }

    return [];
};

(async () => {
    const data = await SearchRepositories(
        "hello neighbor"
    );
    console.log(data);
})();