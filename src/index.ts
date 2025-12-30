import axios from "axios";

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

(async () => {
    const data = await GetReactBuilder(
        "https://github.com/search?q=hello%20neighbor&type=repositories"
    );
    console.log(data);
})();