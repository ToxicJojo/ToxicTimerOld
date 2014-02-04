package org.jojo.toxictimer.api.post;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jojo.toxictimer.api.BaseServlet;
import org.jojo.toxictimer.api.Race;
import org.jojo.toxictimer.api.exceptions.RaceNotFoundExcpetion;
import org.jojo.toxictimer.api.exceptions.RunnerNotFoundException;

@WebServlet("/post/Status")
public class PostStatus extends BaseServlet {
	private static final long serialVersionUID = 1L;

	public PostStatus() {
		super();
		servletName = "post/Status";
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if (this.ConnectToDatabase()) {
			try {
				String runnerCode = request.getParameter("runnerCode");
				String status = request.getParameter("status");

				if (this.ValidateNumber(runnerCode)
						&& this.ValidateStatus(status)) {
					Statement statusStatement = sqlConnection.createStatement();
					statusStatement
							.executeUpdate("UPDATE database.runner SET status = '"
									+ status + "' WHERE code = " + runnerCode);

					Statement raceStatement = sqlConnection.createStatement();
					ResultSet raceResult = raceStatement
							.executeQuery("SELECT idRace FROM database.runner WHERE code='"
									+ runnerCode + "'");

					if (raceResult.next()) {
						Race.Update(raceResult.getInt("idRace"), sqlConnection);
					}
				} else {
					responseCode = HttpServletResponse.SC_BAD_REQUEST;
				}
			} catch (SQLException e) {
				responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
				System.err.println("SQL Error (" + servletName + ")");
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
