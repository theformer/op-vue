<template>
    <ul class="menu-tree">
        <li is="menuBranch" v-for="b in data.root" :key="b" :tree="data.tree" :branch="data.tree[b]" @check="check"></li>
    </ul>
</template>

<script>
    import menuBranch from './menuBranch';

    // 从下至上的状态检查修改上一级的state值（勾选子级==>父级也被勾选）
    function checkParent(pid, treeData, resObj) {
      let parent = treeData[pid];
      if (!parent) return;
      let parentChecked = false;
      let state;

      parent.branch.forEach(function (item) {
        let it = treeData[item];
        let checked = getAttr(resObj, [item, 'state', 'checked'], it.checked);
        let state = getAttr(resObj, [item, 'state', 'state'], it.state);
        if (checked || state === 1) {
          parentChecked = true;
        }
      });

      state = parentChecked ? 1 : 0;

      if (parent.state !== state) {
        addState(resObj, pid, { state: state });
      }
      if (parent.checked !== parentChecked) {
        addState(resObj, pid, { checked: parentChecked });
      }
      checkParent(parent.pid, treeData, resObj);
    }

    // 创建一个更新的对象
    function addState(obj, key, state) {
      let temp = obj[key];
      if (!temp) {
        temp = { state: {} };
        obj[key] = temp;
      }
      for (let i in state) {
        temp.state[i] = state[i];
      }
    }

    // 递归上到下递归修改状态（勾选父级==>不影响子级勾选状态，取消勾选父级==>所有对应的子级都取消勾选）
    function checkSub(id, tree, resObj, checked) {
      let obj = tree[id];
      let targetState = checked ? 1 : 0;

      addState(resObj, id, { checked: checked });

      if (obj.branch && !checked) {
        addState(resObj, id, { state: targetState });
        obj.branch.forEach(function (item) {
          checkSub(item, tree, resObj, checked);
        });
      }
    }

    function getAttr(obj, arr, defaultVal) {
      if (typeof arr === 'string') {
        arr = arr.split('.').filter(function (item) {
          return item;
        });
      }
      arr.every(function (item) {
        return obj = obj[item];
      });
      if (obj === undefined) {
        if (defaultVal === undefined) {
          defaultVal = '';
        }
        return defaultVal;
      }
      return obj;
    }

    export default {
      name: 'menuTree',
      components: {menuBranch},
      props: {
        data: {
          type: Object,
          default: () => {}
        },
        defaultChecked:{
          type: Array,
          default: () => []
        }
      },
      data() {
        return {

        }
      },
      computed: {
        /*treeData() {
          let branch = {};
          let allBranch = {};
          let rootIds = [];
          let fn = (ele, pid) => {
            if (!allBranch[ele.resourceId]) {
              allBranch[ele.resourceId] = ele;
              allBranch[ele.resourceId].branch = [];
              allBranch[ele.resourceId].checked = false;
              if (pid) {
                allBranch[ele.resourceId].pid = pid;
              }
            }
            if (ele.button && ele.button.length) {
              ele.button.forEach(button => {
                button.isButton = true;
                allBranch[ele.resourceId].branch.push(button.resourceId);
                fn(button, ele.resourceId);
              })
            }
            if (ele.child && ele.child.length) {
              ele.child.forEach(child => {
                allBranch[ele.resourceId].branch.push(child.resourceId);
                fn(child, ele.resourceId)
              });
            }
          };
          this.data.forEach(ele => {
            fn(ele);
            rootIds.push(ele.resourceId);
          });
          return {
            root: rootIds,
            tree: allBranch
          };
        }*/
      },
      created() {
        //this.setCheckedKeys(this.defaultChecked)
      },
      methods: {
        setCheckedKeys(arr) {
          arr.forEach(ele => {
            this.check(ele)
          });
        },
        getCheckedKeys() {
          let keys = [];
          const tree = this.data.tree;
          for(let i in tree) {
            if (tree[i].checked || tree[i].state === 1) {
              keys.push(i)
            }
          }
          return keys;
        },
        check: function (branchId) {
          let state = {}; // 需要更新的状态
          let tree = this.data.tree;
          /*console.log('branchId', branchId);
          console.log('tree[branchId]', tree[branchId]);
          console.log(!tree[branchId].checked)*/
          checkSub(branchId, tree, state, !tree[branchId].checked); // 从当前的节点往下递归计算选中状态并将需要更新的状态存入state中
          checkParent(tree[branchId].pid, tree, state); // 从当前的节点往上计算状态并将需要更新的状态存入state中
          //console.log('state', state);
          this.$emit('update', state);
        },

        /*toggle: function (branchId) {
          let state = {}; // 需要更新的状态
          addState(state, branchId, { open: !this.tree[branchId].open }); //将状态添加到state中
          this.$emit('update', state);
        }*/
      },
      watch: {
        'defaultChecked'(val) {
          this.setCheckedKeys(val)
        }
      }
    }
</script>

<style lang="scss" scoped>
    .menu-tree{
        margin: 10px 0 0;
        padding: 0;
        list-style: none;
        li{
            margin: 0;
            padding: 0;
            list-style: none;
            line-height: 26px;
        }
    }
</style>