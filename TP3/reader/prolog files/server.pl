:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).
:-set_prolog_flag(discontiguous_warnings, off).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here
parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

% Modified functions
choose_move_mod(X,P,P1,P2) :-
	difficulty(e),
	choose_random_move_mod(X,P,P1,P2), !;
	difficulty(h),
	choose_wise_move_mod(X,P,P1,P2).

choose_random_move_mod(X,P,P1,P2) :-
	random(0, 2, N),
	(N = 0, choose_random_piece(X),
			piece_exists(X),
			choose_random_position(P),
			place_piece(X, P),
			display_chosen(X, P), !;
	(N = 1, choose_first_possible_move(P1, P2, V1, V2),
			check_creates_tower(V1, V2, NV),
			create_tower(P1, P2, NV),
			format('The PC moved a piece from position number ~w to position number ~w!\n\n', [P1, P2]), !));
	choose_random_move.

choose_wise_move_mod(X,P,P1,P2) :-
	choose_first_possible_move(P1, P2, V1, V2),
	check_creates_tower(V1, V2, NV),
	create_tower(P1, P2, NV),
	format('The PC moved a piece from position number ~w to position number ~w!\n\n', [P1, P2]), !;
	choose_placement_board(P, V),
	choose_piece_acordingly(V, X),
	place_piece(X, P),
	display_chosen(X, P), !;
	choose_random_piece(X),
	piece_exists(X),
	choose_random_position(P),
	place_piece(X, P),
	display_chosen(X, P), !.

% Answers to the requests
parse_input(retract_everything, retracted) :-
	retract_everything.

parse_input(assert_everything, asserted) :-
	assert_everything.

parse_input(switch_turn, switched) :-
	switch_player.

parse_input(round_over, round_is_over) :-
	round_over.

parse_input(count_points_players, points(P1,P2)) :-
	count_points_players,
	points_player_1(P1),
	points_player_2(P2),
	format('P1: ~w | P2: ~w\n', [P1, P2]).

parse_input(choose_move, move_chosen(X,P,P1,P2)) :-
	choose_move_mod(X,P,P1,P2),
	display_info.

parse_input(game_mode(M), game_mode_set) :-
	retract(game_mode(_)),
	assert(game_mode(M)).

parse_input(difficulty(D), difficulty_set) :-
	retract(difficulty(_)),
	assert(difficulty(D)).

parse_input(chosen_board(B), chosen_board_set) :-
	retract(chosen_board(_)),
	assert(chosen_board(B)).

parse_input(place_piece(X,P), placed) :-
	piece_exists(X),
	avaiable_pos_placement(P),
	place_piece(X,P),
	display_info.

parse_input(move_piece(P1,P2), moved) :-
	move_piece(P1,P2),
	display_info.