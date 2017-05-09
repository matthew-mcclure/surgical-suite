(function () {
	'use strict'

	angular
		.module('public')
		.factory('SampleService', SampleService)

	function SampleService($http) {
		return {
			getAll,
			insertOne
		}

		function getAll(onSuccess, onError) {
			$http.get('/api/sample/sample')
			.then((response) => {
				onSuccess(response.data)
			})
			.catch((response) => {
				onError(response)
			})
		}

		function insertOne(onSuccess, onError) {
			$http.get('/api/sample/rooms')
			.then((response) => {
				onSuccess(response.data)
			})
			.catch((response) => {
				onError(response)
			})
		}
	}
})()