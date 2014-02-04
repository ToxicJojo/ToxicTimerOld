package org.jojo.toxictimer.api.get;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jojo.toxictimer.api.BaseServlet;
import org.jojo.toxictimer.api.Race;

@WebServlet("/get/RaceCount")
public class GetRaceCount extends BaseServlet {
	private static final long serialVersionUID = 1L;

	public GetRaceCount() {
		super();
		servletName = "get/RaceCount";
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if (this.ConnectToDatabase()) {
			if (this.SetUpWriter(response, request)) {
				try {
					this.WriteResponse(Race.GetRaceCount(sqlConnection));
				} catch (SQLException e) {
					responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
					System.err.println("SQL Error (" + servletName + ")");
				}
			}
			this.EndDatabaseConnection();
		}
		response.setStatus(responseCode);
	}

}
