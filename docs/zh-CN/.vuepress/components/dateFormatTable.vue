<template>
    <table>
        <thead style='text-align:center; vertical-align:middle; font-weight: bold;'>全部的日期格式：</thead>
        <tbody>
            <tr>
                <td>格式</td>
                <td>输出</td>
            </tr>
            <tr>
                <td colspan="2" style='text-align: center;'>月份 (Month)</td>
            </tr>
            <tr>
                <td>M</td>
                <td>1 2 ... 11 12</td>
            </tr>
            <tr>
                <td>MM</td>
                <td>01 02 ... 11 12</td>
            </tr>
            <tr>
                <td>MMM</td>
                <td>Jan Feb ... Nov Dec</td>
            </tr>
            <tr>
                <td>MMMM</td>
                <td>January February ... Nobermber December</td>
            </tr>
            <tr>
                <td colspan="2" style='text-align: center;'>日期 (Day of Month)</td>
            </tr>
            <tr>
                <td>D</td>
                <td>1 2 ... 30 31</td>
            </tr>
            <tr>
                <td>Do</td>
                <td>1st 2nd ... 30th 31st</td>
            </tr>
            <tr>
                <td>DD</td>
                <td>01 02 ... 30 31</td>
            </tr>
            <tr>
                <td colspan="2" style='text-align: center;'>星期 (Day of Week)</td>
            </tr>
            <tr>
                <td>d</td>
                <td>0 1 ... 5 6</td>
            </tr>
            <tr>
                <td>ddd</td>
                <td>Sun Mon ... Fri Sat</td>
            </tr>
            <tr>
                <td>dddd</td>
                <td>Sunday Monday ... Friday Saturday</td>
            </tr>
            <tr>
                <td colspan="2" style='text-align: center;'>年份 (Year)</td>
            </tr>
            <tr>
                <td>YY</td>
                <td>70 71 ... 29 30</td>
            </tr>
            <tr>
                <td>YYYY</td>
                <td>1970 1971 ... 2029 2030</td>
            </tr>
            <tr>
                <td colspan="2" style='text-align: center;'>上/下午 (AM/PM)</td>
            </tr>
            <tr>
                <td>A</td>
                <td>AM PM</td>
            </tr>
            <tr>
                <td>a</td>
                <td>am pm</td>
            </tr>
            <tr>
                <td colspan="2" style='text-align: center;'>时 (Hour)</td>
            </tr>
            <tr>
                <td>H</td>
                <td>0 1 ... 22 23</td>
            </tr>
            <tr>
                <td>HH</td>
                <td>00 01 ... 22 23</td>
            </tr>
            <tr>
                <td>h</td>
                <td>1 2 ... 11 12</td>
            </tr>
            <tr>
                <td>hh</td>
                <td>01 02 ... 11 12</td>
            </tr>
            <tr>
                <td colspan="2" style='text-align: center;'>分 (Minute)</td>
            </tr>
            <tr>
                <td>m</td>
                <td>0 1 ... 58 59</td>
            </tr>
            <tr>
                <td>mm</td>
                <td>00 01 ... 58 59</td>
            </tr>
            <tr>
                <td colspan="2" style='text-align: center;'>秒 (Second)</td>
            </tr>
            <tr>
                <td>s</td>
                <td>0 1 ... 58 59</td>
            </tr>
            <tr>
                <td>ss</td>
                <td>00 01 ... 58 59</td>
            </tr>
            <tr>
                <td colspan="2" style='text-align: center;'>毫秒 (Fractional Second)</td>
            </tr>
            <tr>
                <td>S</td>
                <td>0 1 ... 8 9</td>
            </tr>
            <tr>
                <td>SS</td>
                <td>0 1 ... 98 99</td>
            </tr>
            <tr>
                <td>SSS</td>
                <td>0 1 ... 998 999</td>
            </tr>
            <tr>
                <td>SSSS</td>
                <td>0 1 ... 9998 9999</td>
            </tr>
        </tbody>
    </table>
</template>
    
<script>
export default {
    name: 'date-format-table',
    data() {
        return {};
    },
    computed: {},
    components: {},
    created() {},
    mounted() {},
    methods: {}
};
</script>
    
<style lang="less" scoped>
</style>