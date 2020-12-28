/**
 * Demo data that can locally be imported to mock a backend.
 * Used in liquido-api.js
 */

module.exports = {
	"team": {
		"name": "Team Doogie",
		"admin": {
			"id": "5fddedda8e4d175ffc4ab6a3",
			"name": "Doogie",
			"email": "doogie_admin@doogie.de",
			"isAdmin": true
		},
		"members": [
			{
				"id": "5fddedda8e4d175ffc4ab6a3",
				"name": "Doogie",
				"email": "doogie_admin@doogie.de",
				"isAdmin": true
			},
			{
				"id": "ffffeffa8e4dfffffc4ab6a3",
				"name": "TeamMember1",
				"email": "member1@doogie.de",
				"isAdmin": false
			}
		]
	},
	"polls": [
		{
			"id": "1",
			"teamId": 1,
			"title": "Das ist meine Abstimmung",
			"status": "ELABORATION",
			"proposals": [
				{
					"id": "5fddee258e4d175ffc4ab6a4",
					"title": "Erste Vorschlag",
					"description": "Das ist <b>überhaupt</b> der beste Vorschlag mit der längste Beschreibung überhaupt,"+
						"denn ich brauch ja hier viel Platz um das zu beschreiben. Und sdaofiasdkf lkw tgflkjvoasdj "+
						"as dlfkjlakdsj flasfladsfl adf.",
					"createdBy": {
						$ref: "users/5fddedda8e4d175ffc4ab6a3"
					},
					"numSupporters": 0
				},
				{
					"id": "fffffe258e4d175ffc4ab6a4",
					"title": "Zweiter Vorschlag",
					"description": "askfw elkntlkv9i xcvlk waelkf fnwldoi vjdvcvn adsg a askfn ew.",
					"createdBy": {
						$ref: "users/ffffeffa8e4dfffffc4ab6a3"
					},
					"numSupporters": 0
				}
			],

		},
		{
			"id": "3",
			"teamId": 1,
			"title": "Das ist die zweite Abstimmung",
			"status": "ELABORATION",
		}
	],
	"user": {
		"id": "5fddedda8e4d175ffc4ab6a3",
		"name": "Doogie",
		"email": "doogie_admin@doogie.de",
		"isAdmin": true
	},
	"jwt": "eyJhbGciOiJIUzI1NiJ9.eyJ0ZWFtTmFtZSI6IlRlYW0gRG9vZ2llIiwic3ViIjoiZG9vZ2llX2FkbWluQGRvb2dpZS5kZSJ9.S3pEyiDb27Pps5234smi3V6gRnZUPRGxIP2Ac3SKfWY",
	"voterToken": "7763ad371ee36f04cae6d534eb9e063c"
}