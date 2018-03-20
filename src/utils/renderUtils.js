/**
 * Function description.
 *
 * @param data 'brands' from api.
 * @returns changing the structure of data from api
 */
export function __mapToDataBrands(brands) {
    return [
        {text: '', id: ''},
        ...brands.map((brand) => ({
            text: brand.trend_name,
            id: brand.trend_id
        }))
    ];
}
/**
 * Function description.
 *
 * @param data 'tags' from api.
 * @returns changing the structure of data from api
 */
export function __mapToDataTags(tags){
    return tags.map(tag => ({
        text: tag.tag_name,
        id: tag.tag_id
    }));
};
/**
 * Function description.
 *
 * @param data 'goods' from api.
 * @returns changing the structure of data from api
 */
export function __mapToGoodsDataTags(goods){
    if (goods) {
        return goods.tags.map(tag => {
            return tag.tag_id;
        });
    } else return [];
};
/**
 * Function description.
 *
 * @param data 'goods' from api.
 * @returns changing the structure of data from api
 */
export function  __mapToDataGoods(props){
    if (props && props.length) {
        return props.map(good => {
            return {
                id: good.good_id,
                text: good.good_name
            };
        });
    }
};