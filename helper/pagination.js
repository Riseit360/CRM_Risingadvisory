// helpers/pagination.js

const paginateData = async (model, page, pageSize, sortCriteria = { Date: -1 }) => {
    try {
        const skip = (page - 1) * pageSize;
        const totalRecords = await model.countDocuments();
        const totalPages = Math.ceil(totalRecords / pageSize);

        const data = await model.find({})
            .sort(sortCriteria)
            .skip(skip)
            .limit(pageSize);

        return {
            Status: "suc",
            data,
            totalPages,
            currentPage: page,
            pageSize
        };
    } catch (error) {
        console.error("Error fetching paginated data:", error);
        return {
            Status: "err",
            Msg: "Error fetching paginated data"
        };
    }
};


// Export the Rout Functions
module.exports = paginateData;