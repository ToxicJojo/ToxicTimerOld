package org.jojo.toxictimer.api.post;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jojo.toxictimer.api.BaseServlet;
import org.jojo.toxictimer.api.Race;
import org.jojo.toxictimer.api.Runner;
import org.jojo.toxictimer.api.exceptions.RaceNotFoundExcpetion;
import org.jojo.toxictimer.api.exceptions.RunnerNotFoundException;

@WebServlet("/post/CreateRace")
public class PostCreateRace extends BaseServlet {
	private static final long serialVersionUID = 1L;

	public PostCreateRace() {
		super();
		servletName = "post/CreateRace";
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		if (this.ConnectToDatabase()) {
			try {
				if (this.SetUpWriter(response, request)) {
					String gameId = request.getParameter("gameId");
					String runId = request.getParameter("runId");

					String playerName = request.getParameter("playerName");

					if (this.ValidateNumber(gameId)
							&& this.ValidateNumber(runId)
							&& this.ValidateName(playerName)) {

						if (Runner.NameAvailable(playerName, sqlConnection)) {

							String raceId = Race.CreateRace(gameId, runId,
									sqlConnection);
							
							String code = Runner.JoinRace(playerName,
									Integer.parseInt(raceId), sqlConnection);

							this.WriteResponse(Runner.GetRunner(code,
									sqlConnection).getId() + ";" + code + ";" + raceId);
						} else {
							this.WriteResponse("NameTaken");
						}
					} else {
						responseCode = HttpServletResponse.SC_BAD_REQUEST;
					}
				}
			} catch (SQLException e) {
				responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
				System.err.println("SQL Error (" + servletName + ")");
				e.printStackTrace();
			} catch (NumberFormatException e) {
				responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
				e.printStackTrace();
			} catch (RunnerNotFoundException e) {
				responseCode = HttpServletResponse.SC_NO_CONTENT;
				e.printStackTrace();
			} catch (RaceNotFoundExcpetion e) {
				responseCode = HttpServletResponse.SC_NO_CONTENT;
				e.printStackTrace();
			}

			this.EndDatabaseConnection();
		}
		response.setStatus(responseCode);

	}

}
