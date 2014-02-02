package org.jojo.toxictimer.api;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.jojo.toxictimer.api.exceptions.GameNotFoundException;
import org.jojo.toxictimer.api.exceptions.RunNotFoundExceptions;

public class Game {

	private int id;
	private String abbreviation;
	private String name;
	private ArrayList<Run> runs;

	public Game(int pId, String pAbbreviation, String pName,
			ArrayList<Run> pRuns) {
		this.id = pId;
		this.abbreviation = pAbbreviation;
		this.name = pName;
		this.runs = pRuns;
	}

	/**
	 * Return the game associated with the given id.
	 * @param pGameId The id of the game.
	 * @param pSqlConnection The sqlConnection to use.
	 * @return 
	 * @throws SQLException
	 * @throws RunNotFoundExceptions
	 * @throws GameNotFoundException Is thrown if there is no game with the given id.
	 */
	public static Game GetGame(int pGameId, Connection pSqlConnection)
			throws SQLException, RunNotFoundExceptions, GameNotFoundException {
		Game game = null;

		Statement gameStatement = pSqlConnection.createStatement();
		ResultSet gameResult = gameStatement
				.executeQuery("SELECT * FROM database.Game WHERE idGame = '"
						+ pGameId + "'");

		if (gameResult.next()) {
			Statement runStatement = pSqlConnection.createStatement();
			ResultSet runResult = runStatement
					.executeQuery("SELECT * FROM database.Run WHERE idGame = "
							+ pGameId);
			ArrayList<Run> runs = new ArrayList<Run>();

			while (runResult.next()) {
				runs.add(Run.GetRun(runResult.getInt("idRun"), pSqlConnection));
			}

			game = new Game(pGameId, gameResult.getString("abbreviation"),
					gameResult.getString("name"), runs);
		} else {
			throw new GameNotFoundException(pGameId);
		}

		return game;
	}

	/**
	 * Return an ArrayList containing all the games in the database.
	 * @param pSqlConnection The sqlConnection to use.
	 * @return	An ArrayList containing all the games in the database.
	 * @throws SQLException
	 * @throws RunNotFoundExceptions
	 * @throws GameNotFoundException
	 */
	public static ArrayList<Game> GetGameList(Connection pSqlConnection)
			throws SQLException, RunNotFoundExceptions, GameNotFoundException {
		ArrayList<Game> gameList = new ArrayList<Game>();

		Statement gamesStatement = pSqlConnection.createStatement();

		ResultSet gamesResult = gamesStatement
				.executeQuery("SELECT * FROM database.Game");

		while (gamesResult.next()) {
			Game game = Game.GetGame(gamesResult.getInt("idGame"),
					pSqlConnection);
			gameList.add(game);
		}

		return gameList;
	}

}
