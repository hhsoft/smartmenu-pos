export default {
  production: {
    cloudfront: {
      host: "https://d338b1kw6xot0l.cloudfront.net"
    },
    host: "https://staging.waitless.co.kr/",
    errorHandler: function(scope) {
      return function(result) {
        if (!result.data.res) {
          window.alert(result.data.msg);
          if (result.data.code == 400) {
            scope.$router.push("/")
          }
        } else {
          return result
        }
      }
    }
  },
  development: {
    cloudfront: {
      host: "https://d1tbx5pakkr5qn.cloudfront.net"
    },
    host: "http://" + location.hostname + ":3000/",
    errorHandler: function(scope) {
      return function(result) {
        if (!result.data.res) {
          window.alert(result.data.msg);
          if (result.data.code == 400) {
            scope.$router.push("/")
          }
        } else {
          return result
        }
      }
    }
  }
}