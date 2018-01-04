/**
 * Created by yijaejun on 01/02/2017.
 */
'use strict';

class Login {
	constructor(name) {
		this._name = name;
	}
	doLogin (){
		console.log('login by ' + this._name);
	}
}

export default Login;
