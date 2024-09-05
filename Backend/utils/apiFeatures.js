class APIFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    filter() {
      // Handle filtering
      const filterConditions = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
      this.query = this.query.find({ ...filterConditions });
      return this;
    }
  
    sort() {
      // Handle sorting
      const sortBy = { ...this.queryStr };
      console.log(sortBy);
      
      // Remove unnecessary fields from sortBy
      const sortFields = ["keyword", "page", "sortBy"];
      sortFields.forEach(field => delete sortBy[field]);
      console.log(sortBy);
      
      let sortQuery = JSON.stringify(sortBy);
      sortQuery = sortQuery.replace(/\b(gt|gte|lt|lte)\b/g, (match) => "$" + match);
      console.log(sortQuery);
      
      this.query = this.query.sort(JSON.parse(sortQuery));
      return this;
    }
  
    paginate(resultsPerPage) {
      // Handle pagination
      const page = Number(this.queryStr.page) || 1;
      const skip = resultsPerPage * (page - 1);
      this.query = this.query.limit(resultsPerPage).skip(skip);
      return this;
    }
  
    execute() {
      // Execute the query with the applied filters, sorting, and pagination
      return this.query;
    }
  }
  
  module.exports = APIFeatures;
  