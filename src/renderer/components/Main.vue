<template>
<div class="root">
  <div class="order-container">
    <div class="order-item" v-for="order in orderedOrderList" v-on:click="selectOrder(order)">
      <div class="order-number">
        #{{order.number}}
      </div>
      <div class="order-menu-list">
        <div class="order-menu-item" v-for="orderMenu in limitOrderList(order.OrderMenus)">
          <div class="order-menu-title">
            {{orderMenu.title}}
          </div>
        </div>
        <div class="menu-list-more" v-if="limitExtraOrderListCount(order.OrderMenus)>0">외 {{limitExtraOrderListCount(order.OrderMenus)}}건</div>
      </div>
      <div class="total-price">{{orderTotalPrice(order)|formatNumber}}</div>
      <img src="static/img/ic_spread.png" class="more-btn">
    </div>
  </div>
  <div d-flex class="payment-container">
    <div class="payment-inner-container">

      <v-layout column wrap fill-height>
        <div class="top-container">
          결제내역
        </div>
        <v-flex class="select-order-container">
          <div class="select-order-inner-container" v-if="selectedOrder">
            <v-layout v-for="order in selectedOrder.OrderMenus" class="order-item">
              <v-flex class="order-title">
                {{order.title}}
              </v-flex>
              <div class="price">{{order.price|formatNumber}}</div>
              <div class="count">
                <img src="static/img/ic_minus.png" alt="" class="count-btn" v-on:click="countDown(order)">
                <div class="count-label">
                  {{order.count}}
                </div>
                <img src="static/img/ic_plus.png" alt="" class="count-btn" v-on:click="countUp(order)">
              </div>
              <div class="delete-btn" v-on:click="removeOrderItem(selectedOrder, order)">
                <img src="static/img/ic_delete2.png" alt="">
              </div>
            </v-layout>
          </div>
        </v-flex>
        <div>
          <v-layout class="total-container">
            <v-flex class="label">TOTAL</v-flex>
            <div class="price">
              {{orderTotalPrice(selectedOrder)|formatNumber}}
            </div>
          </v-layout>
          <div class="payment-btn" v-on:click="payment">결제하기</div>
        </div>
      </v-layout>
    </div>
  </div>
  <notifications width="380px" position="bottom left" group="foo">
    <template slot="body" slot-scope="props">
      <div class="notification">
        <v-layout>
          <v-flex class="noti-title">
            <div v-if="props.item.type=='call'">
              <span class="notice">{{props.item.data.number}}</span> 자리에서 <span class="notice">호출</span>합니다
            </div>
            <div v-if="props.item.type=='spoon'">
              <span class="notice">{{props.item.data.number}}</span> 자리에서 <span class="notice">숟가락</span>이 필요합니다
            </div>
            <div v-if="props.item.type=='chopsticks'">
              <span class="notice">{{props.item.data.number}}</span> 자리에서 <span class="notice">젓가락</span>이 필요합니다
            </div>
            <div v-if="props.item.type=='napkin'">
              <span class="notice">{{props.item.data.number}}</span> 자리에서 <span class="notice">휴지</span>가 필요합니다
            </div>
            <div v-if="props.item.type=='fork'">
              <span class="notice">{{props.item.data.number}}</span> 자리에서 <span class="notice">포크</span>가 필요합니다
            </div>
            <div v-if="props.item.type=='water'">
              <span class="notice">{{props.item.data.number}}</span> 자리에서 <span class="notice">물</span>이 필요합니다
            </div>
          </v-flex>
          <v-btn icon @click="props.close">
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </div>
    </template>
  </notifications>
</div>
</template>
<script>
import _ from "underscore"
export default {
  data: function() {
    return {
      orderList: [],
      selectedOrder: null,
      headers: [{
          value: "title",
          text: "Name",
          align: "center",
          sortable: false
        },
        {
          value: "count",
          text: "id",
          sortable: false,
          width: 70,
          align: "center"
        },
        {
          value: "price",
          text: "Price",
          align: "center",
          width: 90,
          sortable: false
        },

      ],
    }
  },
  sockets: {
    connect() {
      if (this.store) {
        this.disconect = false;
        this.$socket.emit("join", this.store._id)
      }
    },
    disconnect() {
      if (this.store) {
        this.$socket.emit("join", this.store._id)
        this.disconect = true;
      }
    },
    order: function(result) {
      console.log(result)
      let self = this
      if (result.res) {
        console.log(result)
        var findedItem = _.find(self.orderList, function(orderItem) {
          return orderItem._id == result.orderedItem._id
        })
        if (findedItem) {
          findedItem.OrderMenus = result.orderedItem.OrderMenus
        } else {
          self.orderList.push(result.orderedItem)
        }
      }

    },
    call: function(result) {
      if (result.res) {
        console.log(result)
        let callItem = result.callItem
        var title = callItem.number + " 자리에서 "

        this.$notify({
          group: 'foo',
          position: "bottom left",
          duration: -1,
          width: "350px",
          title: title,
          store: null,
          type: callItem.type,
          data: {
            number: callItem.number,
          }

        });
      }
    }
  },
  computed: {
    orderedOrderList: function() {
      return _.sortBy(this.orderList, function(item) {
        if (item && item.number) {
          var match = item.number.match(/[0-9]/gi)
          if (match) {
            return Number(match.join(""))
          } else {
            return item.number
          }
        } else {
          return ""
        }
      })
    },

  },
  mounted: function() {
    this.init()
  },
  methods: {
    removeOrderItem: function(orderItem, item) {
      let index = _.indexOf(orderItem.OrderMenus, item)
      if (index > -1) {
        orderItem.OrderMenus.splice(index, 1)
        if (!orderItem.deleteItemList) {
          orderItem.deleteItemList = []
        }
        orderItem.deleteItemList.push(item)
      }
    },
    limitOrderList: function(orderList) {
      return _.first(orderList, 2)
    },
    limitExtraOrderListCount: function(orderList) {
      var count = 0;
      if (orderList.length > 2) {
        count = orderList.length - 2
      }
      return count
    },
    selectOrder: function(order) {
      this.selectedOrder = order
    },
    init: function() {
      let self = this

      this.$service.post("/smartmenu/pos/init").then(function(result) {
        if (result.data.res) {
          self.orderList = result.data.orderList;
          self.store = result.data.store
          self.$socket.emit("join", self.store._id)
        }
      });
    },
    findAndMergeOrderList: function(orderItem, paymentMenus) {
      _.each(paymentMenus, function(menu) {
        console.log(menu.title)
        if (menu.PaymentOptions.length == 0) {

          var findedMenu = _.find(orderItem.orderList, function(findMenu) {
            return findMenu.menuId == menu.menuId
          })
          if (findedMenu) {
            findedMenu.count += menu.count
          } else {
            orderItem.orderList.push(menu)
          }
        } else {
          var match = false
          _.each(orderItem.orderList, function(findedMenu) {
            if (findedMenu.menuId == menu.menuId) {
              _.each(findedMenu.PaymentOptions, function(item, key) {
                if (item.title == menu.PaymentOptions[key].title) {
                  match = true
                  findedMenu.count += menu.count
                }
              })
            }
          })
          if (!match) {
            orderItem.orderList.push(menu)
          }

        }

      })
    },
    orderTotalPrice: function(order) {
      var totalPrice = 0
      if (order) {
        _.each(order.OrderMenus, function(orderItem) {
          totalPrice += orderItem.price * orderItem.count
          _.each(orderItem.PaymentOptions, function(option) {
            if (option.type == "number") {
              totalPrice += option.price * option.count
            } else {
              totalPrice += option.price
            }
          })
        })
      }
      return totalPrice;
    },
    countDown: function(menu) {
      if (menu.count > 1) {
        menu.count--
      }
    },
    countUp: function(menu) {
      if (menu.count < 100) {
        menu.count++
      }
    },
    payment: function() {
      if (!this.selectedOrder) {
        return;
      }
      let self = this
      this.$service.post("/smartmenu/pos/payment", {
        orderItem: this.selectedOrder
      }).then(function(result) {
        if (result.data.res) {
          let index = _.indexOf(self.orderList, self.selectedOrder)
          if (index > -1) {
            self.orderList.splice(index, 1)
            self.selectedOrder = null
          }
        }
      });
      // console.log(self.selectedOrder)
      // self.$socket.emit("payment", self.selectedOrder, function(result) {
      //   console.log(result)
      // })
    }
  }
}
</script>
<style scoped lang="less">
@payment-container-width: 390px;
@yellow: #FFD800;
@white: #fff;
@black: #2F3135;
@border-color: #E4E4E4;
.root {
    height: 100%;
    background: white;
}
.order-container {
    margin: 10px;
    padding-right: @payment-container-width;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    grid-auto-rows: minmax(225px, auto);
    .order-item {
        background: @white;
        padding: 10px 20px;
        background: @black;
        cursor: pointer;
        position: relative;

        .order-number {
            font-size: 20px;
            text-align: left;
            margin-bottom: 10px;
            color: @yellow;
        }
        .order-menu-list {
            color: white;
            font-weight: 500;
            .order-menu-item {
                font-size: 18px;
                padding-top: 3px;
                padding-bottom: 3px;

            }

        }
        .total-price {
            position: absolute;
            bottom: 0;
            color: @yellow;
            font-size: 20px;
        }

        .more-btn {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 70px;
            height: 70px;
        }
    }
}

.payment-container {
    width: @payment-container-width;

    .payment-inner-container {
        border-left: 1px solid #EAEAEA;
        position: fixed;

        right: 0;
        top: 0;
        bottom: 0;
        width: @payment-container-width;

    }
    .top-container {
        padding-top: 20px;
        padding-bottom: 20px;
        font-size: 20px;
        font-weight: 900;
        margin: 0 24px;
        border-bottom: 1px solid @border-color;
    }
    .select-order-container {
        position: relative;
        .select-order-inner-container {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            overflow: auto;
            .order-item {
                margin-left: 24px;
                margin-right: 24px;
                padding-top: 25px;
                padding-bottom: 25px;
                font-weight: 500;
                border-bottom: 1px solid @border-color;
                .order-title {
                    font-size: 18px;
                    width: 110px;
                    margin-right: 20px;
                }
                .price {
                    text-align: right;
                    width: 70px;
                    font-size: 18px;
                    margin-right: 20px;
                }
                .count {
                    min-width: 90px;
                    line-height: 24px;
                    font-size: 13px;
                    margin-right: 20px;
                    .count-btn {
                        cursor: pointer;
                    }
                    .count-label {
                        display: inline-block;
                        width: 30px;
                        text-align: center;
                    }
                    img {
                        vertical-align: middle;
                        width: 24px;
                        height: 24px;
                        display: inline-block;
                    }
                }
                .delete-btn {
                    cursor: pointer;
                    img {
                        width: 24px;
                        height: 24px;
                    }
                }
            }

        }
    }
    .total-container {
        border-top: 1px solid #E4E4E4;
        margin-left: 24px;
        margin-right: 24px;
        padding-top: 14px;
        padding-bottom: 14px;
        .label {
            font-size: 24px;
            font-weight: 900;
        }
        .price {
            font-size: 24px;
            font-weight: 900;
        }
    }
    .payment-btn {
        cursor: pointer;
        background: #2F3135;
        color: #FFD800;
        text-align: center;
        padding-top: 27px;
        padding-bottom: 27px;
        font-size: 24px;
        font-weight: 500;
    }

}
.notification {
    font-size: 20px;
    font-weight: 500;
    padding: 10px;
    margin: 5px;
    background: #e8f9f0;
    border: 1px solid #d0f2e1;
    .noti-title {

        .notice {
            color: red!important;
        }
    }
}
</style>
