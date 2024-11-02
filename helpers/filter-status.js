module.exports = (query) => {
    let filterStatus = [
        {
            name: "All",
            status: "",
            class: ""
        },
        {
            name: "Active",
            status: "active",
            class: ""
        },
        {
            name: "Inactive",
            status: "inactive",
            class: ""
        }
    ]

    if (query.status){
        const index = filterStatus.findIndex((item) => item.status === query.status);
    }

    else{
        const index = filterStatus.findIndex((item) => item.status=="");
    }

    return filterStatus;
}