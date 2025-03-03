import { NextApiRequest, NextApiResponse } from "next";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests allowed" });
    }

    const { html } = req.body;

    const gistData = {
        description: "HTML Preview",
        public: true,
        files: {
            "index.html": {
                content: html,
            },
        },
    };

    try {
        const response = await fetch("https://api.github.com/gists", {
            method: "POST",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(gistData),
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        // Use the `error` variable (e.g., log it)
        console.error("Error creating Gist:", error);
        res.status(500).json({ error: "Error creating Gist" });
    }
}
