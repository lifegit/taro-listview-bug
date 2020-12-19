import Taro  from "@tarojs/taro";
import React,{Component} from 'react'
import { View, Image } from "@tarojs/components";
import ListView, { LazyBlock } from "taro-listView";
let pageIndex = 1;
export default class Index extends Component {
  state = {
    isLoaded: false,
    error: false,
    hasMore: true,
    isEmpty: false,
    list: []
  };
  getData = async (pIndex = pageIndex) => {
    if (pIndex === 1) this.setState({ isLoaded: false });
    const {
      data: { data }
    } = await Taro.request({
      url: "https://cnodejs.org/api/v1/topics",
      data: {
        limit: 10,
        page: pIndex
      }
    });
    return { list: data, hasMore: true, isLoaded: pIndex === 1 };
  };
  componentDidMount() {
    this.getData();
  }
  onScrollToLower = async fn => {
    const { list } = this.state;
    const { list: newList, hasMore } = await this.getData(++pageIndex);
    this.setState({
      list: list.concat(newList),
      hasMore
    });
    fn();
  };
  render() {
    const { isLoaded, error, hasMore, isEmpty, list } = this.state;
    return (
      <View className="lazy-view">
        <ListView
          lazy
          isLoaded={isLoaded}
          hasMore={hasMore}
          style={{ height: "100vh" }}
          onScrollToLower={this.onScrollToLower}
          lazyStorage='lazyViewBlock'
        >
          {list.map((item, index) => {
            return (
              <View className='item' key={index}>
                <LazyBlock current={index} className='avatar' lazyStorage='lazyViewBlock'>
                  <Image className='avatar' src={item.author.avatar_url} />
                </LazyBlock>
                <View className="title">{item.title}</View>
              </View>
            );
          })}
        </ListView>
      </View>
    );
  }
}
