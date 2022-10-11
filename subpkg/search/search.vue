<template>
	<view class="">
		<view class="search-box">
			<!-- 使用 uni-ui 提供的搜索组件 -->
			<uni-search-bar @input="input" :radius="100" cancelButton="none" focus="true"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="keyword.length !==0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<view class="history-item" v-for="(item, i) in historys" :key="i">
					<uni-tag :text="item" @click="gotoGoodsList(item)" circle>
					</uni-tag>
					<uni-icons type="clear" size="18" class="clear-item" color="'#306ddd'"
						@click="clearHistoryItem(item,i)"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				timer: null,
				searchResults: [],
				historyList: ['a', 'app', 'apple']
			};
		},
		computed: {
			historys() {
				// 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
				// 而是应该新建一个内存无关的数组，再进行 reverse 反转
				return [...this.historyList].reverse()
			}
		},
		methods: {
			getSearchList() {
				if (this.keyword === '') {
					this.searchResults = []
					return
				}
				uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.keyword
				}).then((res) => {
					if (res.statusCode === 200) {
						this.searchResults = res.data.message
					} else {
						return uni.$showMsg()
					}
				})
				this.saveSearchHistory()
			},
			input(e) {
				clearTimeout(this.timer)
				// e.value 是最新的搜索内容
				this.timer = setTimeout(() => {
					this.keyword = e
					this.getSearchList()
				}, 500)
			},
			gotoDetail(goods_id) {
				uni.navigateTo({
					// 指定详情页面的 URL 地址，并传递 goods_id 参数
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			saveSearchHistory() {
				const set = new Set(this.historyList)
				set.delete(this.keyword) //先把搜索的关键字删除了，再添加，避免关键字重复
				set.add(this.keyword)
				this.historyList = Array.from(set)
				// 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
				uni.setStorageSync('keyword', JSON.stringify(this.historyList))
			},
			cleanHistory() {
				// 清空 data 中保存的搜索历史
				this.historyList = []
				// 清空本地存储中记录的搜索历史
				uni.setStorageSync('keyword', '[]')
			},
			gotoGoodsList(keyword) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + keyword
				})
			},
			clearHistoryItem(item, i) {
				let newArr = JSON.parse(JSON.stringify(this.historyList))
				let newArr2 = newArr.reverse().splice(i, 1)
				this.historyList = newArr.reverse()
				uni.setStorageSync('keyword', JSON.stringify(this.historyList))
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('keyword') || '[]')
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
		background-color: #C00000;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.history-item {
				position: relative;
				margin-top: 20px;
				margin-right: 10px;
			}

			.uni-tag {
				background-color: #eaeaea;
				color: #000000;
				font-weight: 300;
				border: 1px solid #eaeaea;
			}

			.clear-item {
				position: absolute;
				top: 0;
				right: 0;
				transform: translate(40%, -40%);
			}
		}
	}
</style>
