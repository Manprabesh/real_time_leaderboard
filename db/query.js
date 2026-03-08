export const GET_USER_BY_EMAIL = `
  SELECT * FROM users WHERE email = $1
`;

export const GET_GAME_BY_USERID = `
  SELECT * FROM games where  game_name = $1
`

export const CREATE_GAME = `
INSERT INTO games (user_id, game_name) VALUES ($1, $2) RETURNING id, game_name
`
export const CREATE_SCORE = `
  INSERT INTO scores (user_id, game_id, current_score, best_score) VALUES ($1, $2, $3, $4) RETURNING *
`
export const SEARCH_GAME_SCORE = `
  SELECT * FROM scores WHERE game_id = $1 AND user_id = $2
`

export const UPDATE_SCORE = `
INSERT INTO scores (user_id, game_id, current_score, best_score)
VALUES ($1, $2, $3, $3)
ON CONFLICT (user_id, game_id)
DO UPDATE SET
  current_score = EXCLUDED.current_score,
  best_score = GREATEST(scores.best_score, EXCLUDED.current_score)
RETURNING *;
`;

export const GET_USER_SCORE_GAME =`SELECT
s.user_id, s.current_score, s.best_score ,u.email, g.id AS game_id, g.game_name  FROM scores s
JOIN users u ON s.user_id = u.id
JOIN games g ON s.game_id = g.id
WHERE s.user_id = $1
AND s.game_id = $2`


export const GET_USER_BY_LIMIT_OFFSET = `SELECT id,email from users ORDER BY id Limit $1 OFFSET $2`

export const GET_USER_SCORE_GAME_BY_LIMIT_OFFSET = `SELECT  u.id AS user_id, u.email, g.id AS game_id, g.game_name,
s.current_score, s.best_score FROM users u 
JOIN scores s ON s.user_id = u.id
JOIN games g ON g.id = s.game_id
WHERE u.id = $1
ORDER BY u.id
LIMIT $2
OFFSET $3;`

export const GET_USER_PROFILE = `SELECT s.current_score, s.best_score, g.game_name, g.id AS game_id, u.email
FROM scores s
JOIN games g ON g.id = s.game_id
JOIN users u on s.user_id = u.id
WHERE s.user_id = $1`

export const DELETE_USER = `DELETE FROM users WHERE id = $1 RETURNING *`