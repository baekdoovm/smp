const { put, get } = require("@vercel/blob");

const DATA_FILE = "data.json";

async function loadData() {
    const result = await get(DATA_FILE, {
        access: "private",
        useCache: false
    });

    if (!result || result.statusCode !== 200) {
        return {
            users: [],
            posts: [],
            messages: [],
            notices: []
        };
    }

    const text = await new Response(result.stream).text();

    return JSON.parse(text);
}

module.exports = async function handler(req, res) {

    try {

        // 데이터 불러오기
        if (req.method === "GET") {

            const data = await loadData();

            return res.status(200).json(data);
        }


        // 데이터 저장하기
        if (req.method === "POST") {

            const data = req.body;

            await put(
                DATA_FILE,
                JSON.stringify(data, null, 2),
                {
                    access: "private",
                    addRandomSuffix: false,
                    contentType: "application/json"
                }
            );

            return res.status(200).json({
                success: true
            });
        }


        return res.status(405).json({
            error: "Method Not Allowed"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Server Error"
        });
    }
};
