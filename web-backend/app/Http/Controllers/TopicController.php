<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TopicController extends Controller
{
    public function index(Request $request)
    {
        $query = Topic::query();

        if ($search = $request->input('search')) {
            $query->whereRaw("name LIKE '%" . $search . "'%");
        }

        $limit = $request->input('limit') ?? 5;

        $data = $query->select('id', 'name')
                    ->orderBy('created_at', 'desc')
                    ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function all()
    {
        $data = Topic::all();

        return $this->responseSuccess('Data', $data);
    }

    public function show($id)
    {
        $data = Topic::select('id', 'name')
                        ->where('id', $id)
                        ->first();

        if (!$data) return $this->responseFailed('Topic not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $data = Topic::create($validator->validated());

        return $this->responseSuccess('Topic successfully created', $data, 201);
    }

    public function update(Request $request, $id)
    {
        $topic = Topic::where('id', $id)->first();
        if (!$topic) return $this->responseFailed('Topic not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $topic->update($validator->validated());

        $data = Topic::find($id);

        return $this->responseSuccess('Topic successfully updated', $data, 200);
    }

    public function destroy($id)
    {
        $topic = Topic::where('id', $id)->first();
        if (!$topic) return $this->responseFailed('Topic not found', '', 404);

        $topic->delete();

        return $this->responseSuccess('Topic successfully deleted');
    }
}
