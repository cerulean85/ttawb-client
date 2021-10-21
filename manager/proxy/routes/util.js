module.exports = {


    datetimeFormatting: function (dt, format="YYYY-MM-DD HH:mm:ss") {
        let month = dt.getMonth() + 1;
        let day = dt.getDate();
        let hour = dt.getHours();
        let minute = dt.getMinutes();
        let second = dt.getSeconds();

        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;
        hour = hour >= 10 ? hour : '0' + hour;
        minute = minute >= 10 ? minute : '0' + minute;
        second = second >= 10 ? second : '0' + second;

        return dt.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    },

    dateFormatting: function (dt, format="YYYY-MM-DD HH:mm:ss") {
        let month = dt.getMonth() + 1;
        let day = dt.getDate();

        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;

        return dt.getFullYear() + '-' + month + '-' + day;
    },


}